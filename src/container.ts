import {
    TypeIdentifierMap,
    TImplementationMap,
    TDependencies,
    TImplementationScope,
    TConfiguration,
    TAnyImplementation,
    TDependencyDescriptor,
    TContainerInternal,
    TTypeIdentifier,
    TAnyTypeIdentifier
} from "./types";
import { createTypeIdentifier } from "./typeIdentifier";
import { createLazy } from "./lazy";

const IS_SINGLETON = "_typeinjectIsSingleton";
const SINGLETON = "_typeinjectSingleton";
const TYPE_ID = "_typeinjectTypeId";

export class Container implements TContainerInternal {
    private typeIndex: number = 0;
    private typeIdentifiers: TypeIdentifierMap = {};
    private implementations: TImplementationMap = {};
    private dependencies: TDependencies = {};
    private defaultScope: TImplementationScope = 'transient';
    private showCircularDependencyError: boolean = true;
    private showLazyPotentialCircularWarning: boolean = false;
    private showSingletonPotentialCircularWarning: boolean = true;

    public configure = (configuration: TConfiguration) => {
        if (configuration.defaultScope != null) {
            this.defaultScope = configuration.defaultScope;
        }
        if (configuration.showCircularDependencyError != null) {
            this.showCircularDependencyError = configuration.showCircularDependencyError;
        }
        if (configuration.showLazyPotentialCircularWarning != null) {
            this.showLazyPotentialCircularWarning = configuration.showLazyPotentialCircularWarning;
        }
        if (configuration.showSingletonPotentialCircularWarning != null) {
            this.showSingletonPotentialCircularWarning = configuration.showSingletonPotentialCircularWarning;
        }
    }

    private addTypeIdentifier(id: string, children: string[]) {
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
    }

    public generateUniqueImplementationTypeName(name?: string): string {
        return `${this.generateUniqueTypeName()}${name ? `(${name})` : ``}`;
    }

    public generateUniqueTypeName(): string {
        return `_typeinjectType${this.typeIndex++}`;
    }

    public type = <T>(...children: TAnyTypeIdentifier[]): TTypeIdentifier<T> => {
        const id = this.generateUniqueTypeName();
        return this.typeName(id, ...children);
    }

    public typeName = <T>(id: string, ...children: TAnyTypeIdentifier[]): TTypeIdentifier<T> => {
        const childrenIds: string[] = [];
        for (let i = 0; i < children.length; i++) {
            childrenIds.push(children[i].id);
        }
        const type = createTypeIdentifier(id, false, false, this.defaultScope);
        this.addTypeIdentifier(id, childrenIds);
        return type;
    }

    private addImplementation(id: string, implementation: TAnyImplementation) {
        if (!this.implementations[id]) {
            this.implementations[id] = [];
        }
        this.implementations[id].push(implementation);
    }

    public registerImplementation(id: string, implementation: TAnyImplementation, userScope?: TImplementationScope) {
        const scope = userScope ? userScope : this.defaultScope;
        implementation[TYPE_ID] = id;
        if (scope === 'singleton') {
            implementation[IS_SINGLETON] = true;
        }
        const children = this.typeIdentifiers[id];
        this.addImplementation(id, implementation);
        if (children) {
            for (let i = 0; i < children.length; i++) {
                this.addImplementation(children[i], implementation);
            }
        }
    }

    public registerDependencies(id: string, userDependencies: TDependencyDescriptor[]) {
        const dependencies: TDependencyDescriptor[] = [];
        for (let i = 0; i < userDependencies.length; i++) {
            const userDependency = userDependencies[i];
            dependencies.push({
                isLazy: userDependency.isLazy,
                isMulti: userDependency.isMulti,
                id: userDependency.id
            });
        }
        this.dependencies[id] = dependencies;
    }
    
    private createDependencyGetter(dependency: TDependencyDescriptor) {
        return () => {
            if (dependency.isMulti) {
                return this.getMulti(dependency.id);
            }
            else {
                return this.getSingle(dependency.id, 0, []);
            }
        }
    }

    public getConstructorArgs(id: string): any[] {
        const constructorArgs: any[] = [];
        const dependencies = this.dependencies[id];
        for (let i = 0; i < dependencies.length; i++) {
            const dependency = dependencies[i];
            const getter = this.createDependencyGetter(dependency);
            if (dependency.isLazy) {
                constructorArgs.push(createLazy(getter));
            }
            else {
                constructorArgs.push(getter());
            }
        }
        return constructorArgs;
    }

    public getImplementation = <T>(type: TTypeIdentifier<T>): TAnyImplementation => {
        return this.getImplementations(type)[0];
    }

    public getImplementations = <T>(type: TTypeIdentifier<T>): TAnyImplementation[] => {
        return this.implementations[type.id];
    }

    public get = <T>(type: TTypeIdentifier<T>, ...args: any[]): T => {
        return this.getSingle(type.id, 0, args);
    }

    private getSingle<T>(id: string, index: number, args: any[]): T {
        const implementation = this.implementations[id][index];
        const instance = implementation[IS_SINGLETON] && implementation[SINGLETON] ?
            implementation[SINGLETON] :
            new implementation();
        if (implementation[IS_SINGLETON] && !implementation[SINGLETON]) {
            implementation[SINGLETON] = instance;
        }
        return instance;
    }

    private getMulti<T>(id: string): T {
        const implementationCount = this.implementations[id].length;
        const instances: any = [];
        for (let i = 0; i < implementationCount; i++) {
            instances.push(this.getSingle(id, i, []));
        }
        return instances;
    }

    private isCurrentDependencyCircular(
        newDependencyAncestors: string[],
        currentDependencyId: string,
        newIsSingleton: boolean[],
        currentIsLazy: boolean[]
    ): boolean {
        for (let j = 0; j < newDependencyAncestors.length; j++) {
            const dependencyAncestorId = newDependencyAncestors[j];
            if (currentDependencyId === dependencyAncestorId) {
                const dependencyPathString = this.showLazyPotentialCircularWarning || this.showSingletonPotentialCircularWarning || this.showCircularDependencyError
                    ? [...newDependencyAncestors.slice(j), currentDependencyId].join(' -> ')
                    : '';
                const currentHasLazy = currentIsLazy.slice(j).reduce((prev, next) => prev || next, false);
                const newHasSingleton = newIsSingleton.slice(j).reduce((prev, next) => prev || next, false);
                if (currentHasLazy) {
                    if (this.showLazyPotentialCircularWarning) {
                        console.warn(`Potential circular dependency detected (one of the dependencies is lazy): ${dependencyPathString}. To disable this warning, configure 'showLazyPotentialCircularWarning' to be 'false'.`);
                    }
                    break;
                }
                if (newHasSingleton) {
                    if (this.showSingletonPotentialCircularWarning) {
                        console.warn(`Potential circular dependency detected (one of the dependencies is a singleton): ${dependencyPathString}. To disable this warning, configure 'showSingletonPotentialCircularWarning' to be 'false'.`);
                    }
                    break;
                }
                if (!currentHasLazy && !newHasSingleton) {
                    if (this.showCircularDependencyError) {
                        console.error(`Circular dependency detected: ${dependencyPathString}. To disable this error, configure 'showCircularDependencyError' to be 'false'.`);
                    }
                    return true;
                }
            }
        }
        return false;
    }

    private isDependencyVisitCircular(
        visitedIds: string[],
        dependencyId: string,
        dependencyAncestorIds: string[] = [],
        isSingleton: boolean[] = [],
        isLazy: boolean[] = []
    ): boolean {
        const implementation = this.implementations[dependencyId][0];
        const newDependencyAncestors = [
            ...dependencyAncestorIds,
            dependencyId
        ];
        const newIsSingleton = [
            ...isSingleton,
            !!implementation[IS_SINGLETON]
        ];
        visitedIds.push(dependencyId);
        const dependencies = this.dependencies[dependencyId];
        for (let i = 0; i < dependencies.length; i++) {
            const dependency = dependencies[i];
            const implementations = this.implementations[dependency.id];
            const childDependencyIsLazy = dependency.isLazy;
            for (let j = 0; j < (dependency.isMulti ? implementations.length : 1); j++) {
                const childDependencyId = implementations[j][TYPE_ID];
                const currentIsLazy = [
                    ...isLazy,
                    childDependencyIsLazy
                ];
                if (this.isCurrentDependencyCircular(newDependencyAncestors, childDependencyId, newIsSingleton, currentIsLazy)) {
                    return true;
                }
                if (~visitedIds.indexOf(childDependencyId)) {
                    continue;
                }
                if (this.isDependencyVisitCircular(visitedIds, childDependencyId, newDependencyAncestors, newIsSingleton, currentIsLazy)) {
                    return true;
                }
            }
        }
        return false;
    }

    public hasCircularDependencies = () => {
        const visitedIds: string[] = [];
        for (let dependencyId in this.dependencies) {
            if (this.isDependencyVisitCircular(visitedIds, dependencyId, [])) {
                return true;
            }
        }
        return false;
    }
}
