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
    defaultScope?: TImplementationScope,
    defaultLazy?: boolean,
    showStaticWarning?: boolean,
    showSingletonWarning?: boolean,
    showCircularDependencyError?: boolean,
    showLazyPotentialCircularWarning?: boolean
    showSingletonPotentialCircularWarning?: boolean
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

export type TSetup = (instance: any) => void;

export interface TContainerInternal extends TContainer {
    registerImplementation: (id: string, implementation: TAnyImplementation, scope?: TImplementationScope) => void,
    registerDependencies: (id: string, userDependencies: TDependencyUserDescriptor[]) => void,
    transferStaticProperties: (klass: TAnyImplementation, implementation: TAnyImplementation) => void,
    getSelf: (id: string, instance: any) => void,
};

export interface TContainer {
    configure: (configuration: TConfiguration) => void,
    type: (...children: string[]) => void,
    get: <T>(id: string, index: number) => T,
    hasCircularDependencies: () => boolean
};