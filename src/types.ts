export type Lazy<TType> = {
    value: TType;
}

export interface TContainerInternal extends TContainer {
    generateUniqueImplementationTypeName: (name: string) => string,
    generateUniqueTypeName: () => string,
    registerImplementation: (id: string, implementation: TAnyImplementation, userScope?: TImplementationScope) => void,
    registerDependencies: (id: string, userDependencies: TDependencyDescriptor[]) => void,
    getConstructorArgs: (id: string) => any[],
};

export interface TContainer {
    configure: (configuration: TConfiguration) => void,
    type: <T>(...children: TAnyTypeIdentifier[]) => TTypeIdentifier<T>,
    typeName: <T>(name: string, ...children: TAnyTypeIdentifier[]) => TTypeIdentifier<T>,
    getImplementation: <T>(type: TTypeIdentifier<T>) => TAnyImplementation,
    getImplementations: <T>(type: TTypeIdentifier<T>) => TAnyImplementation[],
    get: <T>(type: TTypeIdentifier<T>, ...args: any[]) => T,
    hasCircularDependencies: () => boolean
};

export type TDependencyDecorator = <T>(type: TTypeIdentifier<T>) => ClassDecorator;

export type TInjectDecorator = <T>(...dependencyTypes: TTypeIdentifier<T>[]) => ClassDecorator;

// Type Identifiers



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

export type TDependencyDecoratorIdentifierArg<TInterface> =
    TTypeIdentifier<TInterface> | TScopedTypeIdentifier<TInterface, TImplementationScope>;