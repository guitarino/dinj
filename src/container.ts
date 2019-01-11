export type TypeIdentifierMap = {
    [id: string]: string[];
};

export type TImplementation<TConstructorArgs, TInstanceType> = {
    new(...args: TConstructorArgs[]): TInstanceType;
};

export type TAnyImplementation = TImplementation<any, any>;

export type TImplementationMap = {
    [id: string]: TAnyImplementation[];
};

export type TImplementationScopes = {
    [id: string]: TImplementationScope;
}

export type TImplementationScope = 'singleton' | 'transient';

export type TConfiguration = {
    defaultScope: TImplementationScope,
    defaultLazy: boolean,
    isSingletonWarningDisabled: boolean
};

export type TSingletons = {
    [id: string]: any
};

export type TDependencyDescriptor = {
    isLazy: boolean,
    isMulti: boolean,
    id: string,
    name: string
};

export type TDependencyUserDescriptor = {
    isLazy?: boolean,
    isMulti?: boolean,
    id: string,
    name: string
};

export type TDependencies = {
    [id: string]: TDependencyDescriptor[]
};

function getLazyPropertyName(name) {
    return `_dinjLazyDependency_${name}`;
}

export class Container {
    private typeIndex: number = 0;
    private typeIdentifiers: TypeIdentifierMap = {};
    private implementations: TImplementationMap = {};
    private scopes: TImplementationScopes = {};
    private singletons: TSingletons = {};
    private dependencies: TDependencies = {};
    private isSingletonWarningDisabled: boolean = false;
    private defaultScope: TImplementationScope = 'transient';
    private defaultLazy: boolean = false;

    public configure(configuration: TConfiguration) {
        if (configuration.defaultScope != null) {
            this.defaultScope = configuration.defaultScope;
        }
        if (configuration.defaultLazy != null) {
            this.defaultLazy = configuration.defaultLazy;
        }
        if (configuration.isSingletonWarningDisabled != null) {
            this.isSingletonWarningDisabled = configuration.isSingletonWarningDisabled;
        }
    }

    private addTypeIdentifier(id: string, children: string[]): string {
        if (!this.typeIdentifiers[id]) {
            this.typeIdentifiers[id] = [];
        }
        const typeIdentifiers = this.typeIdentifiers[id];
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const grandchildren = this.typeIdentifiers[child];
            if (!~typeIdentifiers.indexOf(child)) {
                typeIdentifiers.push(child);
            }
            if (grandchildren) {
                this.addTypeIdentifier(id, grandchildren);
            }
        }
        return id;
    }

    public type = (...children: string[]) => {
        return this.addTypeIdentifier(`_dinjType${this.typeIndex++}`, children);
    }

    private addImplementation(id: string, implementation: TAnyImplementation) {
        if (!this.implementations[id]) {
            this.implementations[id] = [];
        }
        this.implementations[id].push(implementation);
    }

    public registerImplementation(id: string, implementation: TAnyImplementation, scope?: TImplementationScope) {
        const children = this.typeIdentifiers[id];
        this.addImplementation(id, implementation);
        this.scopes[id] = scope ? scope : this.defaultScope;
        if (children) {
            for (let i = 0; i < children.length; i++) {
                this.addImplementation(children[i], implementation);
            }
        }
    }

    public registerDependencies(id: string, userDependencies: TDependencyUserDescriptor[]) {
        const dependencies: TDependencyDescriptor[] = [];
        for (let i = 0; i < userDependencies.length; i++) {
            const userDependency = userDependencies[i];
            dependencies.push({
                isLazy: userDependency.isLazy != null ? userDependency.isLazy : this.defaultLazy,
                isMulti: userDependency.isMulti != null ? userDependency.isMulti : false,
                name: userDependency.name,
                id: userDependency.id
            });
        }
        this.dependencies[id] = dependencies;
    }

    public getSelf(id: string, instance: any) {
        if (this.scopes[id] === 'singleton') {
            if (!this.singletons[id]) {
                this.singletons[id] = instance;
            }
            else if(!this.isSingletonWarningDisabled) {
                console.warn(`The dependency ${id} is configured as a singleton. Creating it with 'new' may be unintentional. To disable this warning, configure 'isSingletonWarningDisabled' to be 'true'.`);
            }
        }
        const dependencies = this.dependencies[id];
        for (let i = 0; i < dependencies.length; i++) {
            const dependency = dependencies[i];
            if (dependency.isLazy) {
                const lazyPropertyName = getLazyPropertyName(dependency.name);
                instance[lazyPropertyName] = null;
                Object.defineProperty(instance, dependency.name, {
                    get: () => {
                        if (instance[lazyPropertyName]) {
                            return instance[lazyPropertyName];
                        }
                        else {
                            if (dependency.isMulti) {
                                instance[lazyPropertyName] = this.getMulti(dependency.id);
                            }
                            else {
                                instance[lazyPropertyName] = this.get(dependency.id);
                            }
                        }
                    }
                })
            }
            else {
                if (dependency.isMulti) {
                    instance[dependency.name] = this.getMulti(dependency.id);
                }
                else {
                    instance[dependency.name] = this.get(dependency.id);
                }
            }
        }
    }

    public get = <T>(id: string, index: number = 0): T => {
        if (this.scopes[id] === 'singleton') {
            if (this.singletons[id]) {
                return this.singletons[id];
            }
        }
        const implementation = this.implementations[id][index];
        const instance = new implementation();
        if (this.scopes[id] === 'singleton') {
            this.singletons[id] = instance;
        }
        return instance;
    }

    private getMulti<T>(id: string): T {
        const implementationCount = this.implementations[id].length;
        const instances: any = [];
        for (let i = 0; i < implementationCount; i++) {
            instances.push(this.get(id, i));
        }
        return instances;
    }
}

export function createImplementation(container: Container, id: string, dependencies: TDependencyUserDescriptor[], Class: TAnyImplementation, scope?: TImplementationScope) {
    function setup(instance) {
        container.getSelf(id, instance);
        instance._dinjSetupCalled = true;
    }
    const implementation = class extends Class {
        constructor(...args) {
            super(...args, setup);
            if (!this._dinjSetupCalled) {
                setup(this);
            }
        }
    }
    container.registerImplementation(id, implementation, scope);
    container.registerDependencies(id, dependencies);
    return implementation;
}