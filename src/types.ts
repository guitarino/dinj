export type Lazy<TType> = {
    value: TType;
}

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
    id: string
};

export type TDependencies = {
    [id: string]: TDependencyDescriptor[]
};

export interface TContainerInternal extends TContainer {
    configure: (configuration: TConfiguration) => void,
    registerScope: (id: string, userScope?: TImplementationScope) => void;
    registerImplementation: (id: string, implementation: TAnyImplementation) => void,
    registerDependencies: (id: string, userDependencies: TDependencyDescriptor[]) => void,
    transferStaticProperties: (klass: TAnyImplementation, implementation: TAnyImplementation) => void,
    getConstructorArgs: (id: string) => any[],
};

export interface TContainer {
    type: <T>(...children: TTypeIdentifier<any>[]) => TTypeIdentifier<T>,
    typeName: <T>(name: string, ...children: TTypeIdentifier<any>[]) => TTypeIdentifier<T>,
    getDependency: <T>(type: TTypeIdentifier<T>) => TAnyImplementation,
    getDependencies: <T>(type: TTypeIdentifier<T>) => TAnyImplementation[],
    get: <T>(type: TTypeIdentifier<T>, ...args: any[]) => T,
    hasCircularDependencies: () => boolean
};

export type TDependencyDecorator = <T>(type: TTypeIdentifier<T>) => ClassDecorator;

export type TInjectDecorator = <T>(...dependencyTypes: TTypeIdentifier<T>[]) => ClassDecorator;

// Type Identifiers

export interface TTypeIdentifier<T> {
    id: string,
    isLazy: boolean,
    isMulti: boolean,
    scope: TImplementationScope,
    multi: TMultiTypeIdentifier<T>,
    lazy: TLazyTypeIdentifier<T>,
    singleton: TScopedTypeIdentifier<T, 'singleton'>,
    transient: TScopedTypeIdentifier<T, 'transient'>
}

export interface TMultiTypeIdentifier<T> {
    id: string,
    isLazy: false,
    isMulti: true,
    lazy: TLazyMultiTypeIdentifier<T>
}

export interface TLazyTypeIdentifier<T> {
    id: string,
    isLazy: true,
    isMulti: false,
    multi: TLazyMultiTypeIdentifier<T>
}

export interface TLazyMultiTypeIdentifier<T> {
    id: string,
    isLazy: true,
    isMulti: true
}

export interface TScopedTypeIdentifier<T, Scope extends TImplementationScope> {
    id: string,
    scope: Scope
}

export type T_getInjection<TInjectDecoratorArg> =
    TInjectDecoratorArg extends TTypeIdentifier<infer U> ? U :
    TInjectDecoratorArg extends TLazyTypeIdentifier<infer U> ? Lazy<U> :
    TInjectDecoratorArg extends TMultiTypeIdentifier<infer U> ? U[] :
    TInjectDecoratorArg extends TLazyMultiTypeIdentifier<infer U> ? Lazy<U[]> :
    never;

export type T_mapInjectDecoratorArgsToInjections<TInjectDecoratorArgs extends any[]> = {
    [i in keyof TInjectDecoratorArgs]: T_getInjection<TInjectDecoratorArgs[i]>;
};

export type T_getObjectFromTuple<T> = {
    [i in Exclude<keyof T, keyof []>]: T[i]
}

export interface Klass<T extends any[]> {
    new(...args: T): any
}

export type T_getInjections<
    TInjectDecoratorArgs extends any[]
> = T_getObjectFromTuple<
    T_mapInjectDecoratorArgsToInjections<
        TInjectDecoratorArgs
    >
>;

export type TInjectDecoratorKlassArg<TKlass, TInjectDecoratorArgs extends any[]> =
    TKlass extends Klass<infer TKlassConstructorArgs> ?
    TKlassConstructorArgs extends T_getInjections<TInjectDecoratorArgs> ? TKlass:
    never: never;