export type Type<Interface> = {
    isMulti: false,
    isLazy: false,
    multi: TypeMulti<Interface>,
    lazy: TypeLazy<Interface>
};

export type TypeMulti<Interface> = {
    isMulti: true,
    isLazy: false,
    lazy: TypeMultiLazy<Interface>
};

export type TypeLazy<Interface> = {
    isMulti: false,
    isLazy: true,
    multi: TypeMultiLazy<Interface>
};

export type TypeMultiLazy<Interface> = {
    isMulti: true,
    isLazy: true
};

export type Scope = 'singleton' | 'transient' | undefined;

export type Lazy<T> = {
    value: T
};

export type TypeInjected<Interface> =
    Type<Interface> |
    TypeMulti<Interface> |
    TypeLazy<Interface> |
    TypeMultiLazy<Interface>;

export type getInterfaceFromType<T> =
    T extends Type<infer Interface> ? Interface :
    never;

export type getConstructorArgsFromInjectedTupleObject<InjectedTupleObject> = {
    [i in keyof InjectedTupleObject]: getConstructorArgFromType<InjectedTupleObject[i]>
};

export type getConstructorArgsFromInjectedTuple<InjectTuple> =
    Array<any> & getConstructorArgsFromInjectedTupleObject<getObjectFromTuple<InjectTuple>>;

export type UnionToIntersection<Union> = (
    Union extends any
        ? (argument: Union) => void
        : never
) extends (argument: infer Intersection) => void
    ? Intersection
    : never;

export type getInterfacesTupleFromImplementsTuple<ImplementsTuple> = {
    [i in keyof ImplementsTuple]: getInterfaceFromType<ImplementsTuple[i]>
};

export type getInterfaceExtendingInterfacesTuple<InterfacesTuple> =
    UnionToIntersection<
        InterfacesTuple[keyof getObjectFromTuple<InterfacesTuple>]
    >;

export type getInterfaceFromImplementsTuple<ImplementsTuple> =
    getInterfaceExtendingInterfacesTuple<getInterfacesTupleFromImplementsTuple<ImplementsTuple>>;

export type getConstructorArgFromType<T> =
    T extends Type<infer Interface> ? Interface :
    T extends TypeMulti<infer Interface> ? Interface[] :
    T extends TypeLazy<infer Interface> ? Lazy<Interface> :
    T extends TypeMultiLazy<infer Interface> ? Lazy<Interface[]> :
    never;

export type getObjectFromTuple<T> = {
    [i in Exclude<keyof T, keyof []>]: T[i]
};

export type UserClass<
    UserConstructorArgs extends getConstructorArgsFromInjectedTuple<InjectTuple>,
    UserInstanceType extends getInterfaceFromImplementsTuple<ImplementsTuple>,
    ImplementsTuple extends Array<Type<any>>,
    InjectTuple extends Array<TypeInjected<any>>,
> = {
    new(...args: UserConstructorArgs): UserInstanceType;
};

export type removeFirstTupleItem<Tuple extends Array<any>> =
    ((...tuple: Tuple) => any) extends ((first: any, ...removed: infer Result) => any)
        ? Result
        : never;

export type removeFirstTupleItems<
    Tuple extends Array<any>,
    N extends SupportedNumbers
> = {
    finished: Tuple,
    continuing: removeFirstTupleItems<removeFirstTupleItem<Tuple>, Prev<N>>
}[
    Tuple extends []
        ? 'finished'
        : N extends 0
            ? 'finished'
            : 'continuing'
];

export type SupportedNumbers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type Prev<T extends SupportedNumbers> = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10][T];

export type InjectedClassArguments<
    UserConstructorArgs extends Array<any>,
    InjectTuple extends Array<any>,
    Result = InjectTuple['length'] extends SupportedNumbers
        ? removeFirstTupleItems<
            UserConstructorArgs,
            InjectTuple['length']
        >
        : any
> = Result extends Array<any> ? Result : never;

export type InjectedClass<
    UserConstructorArgs extends Array<any>,
    InjectTuple extends Array<any>,
    UserInstanceType,
> = {
    new(...args: InjectedClassArguments<UserConstructorArgs, InjectTuple>): UserInstanceType;
};

export type ConfigureDependencyReturn<
    CurrentScope extends Scope = undefined,
    CurrentImplementsTuple extends Array<Type<any>> = [],
    CurrentInjectTuple extends Array<TypeInjected<any>> = [],
> = {
    implements: <ImplementsTuple extends Array<any>>(...implementedTypes: ImplementsTuple) =>
        ConfigureDependencyReturn<CurrentScope, ImplementsTuple, CurrentInjectTuple>;

    inject: <InjectTuple extends Array<any>>(...injectedTypes: InjectTuple) =>
        ConfigureDependencyReturn<CurrentScope, CurrentImplementsTuple, InjectTuple>;

    scope: <NewScope extends Scope>(scope: Scope) =>
        ConfigureDependencyReturn<NewScope, CurrentImplementsTuple, CurrentInjectTuple>;

    create: <
        UserConstructorArgs extends getConstructorArgsFromInjectedTuple<CurrentInjectTuple>,
        UserInstanceType extends getInterfaceFromImplementsTuple<CurrentImplementsTuple>
    >(
        clss: UserClass<UserConstructorArgs, UserInstanceType, CurrentImplementsTuple, CurrentInjectTuple>
    ) =>
        InjectedClass<UserConstructorArgs, CurrentInjectTuple, UserInstanceType>;
};