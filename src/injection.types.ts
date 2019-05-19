import { Type, TypeMulti, TypeLazy, TypeMultiLazy } from "./type.types";
import { removeFirstTupleItems, SupportedNumbers } from "./tuple.types";
import { UnionToIntersection } from "./union.types";
import { Lazy } from "./lazy.types";

export type Scope = 'singleton' | 'transient';

export type NewableUserClass<InstanceType = any, ConstructorArguments extends Array<any> = Array<any>> = {
    new(...constructorArguments: ConstructorArguments): InstanceType;
}

export type InjectedClassFromInterface<Interface = any, ConstructorArguments extends Array<any> = Array<any>> = {
    new(...args: ConstructorArguments): Interface,
    scope: Scope,
    instance?: Interface,
    userClass: NewableUserClass,
    injectedTypes: InjectedTypes
}

export type TypeInjected<Interface = any> =
    Type<Interface> |
    TypeMulti<Interface> |
    TypeLazy<Interface> |
    TypeMultiLazy<Interface>;

export type getInterfaceFromType<T> =
    T extends Type<infer Interface>
        ? Interface
        : never;

export type getInjectedArgsFromInjectedTupleObject<InjectedTupleObject> = {
    [i in keyof InjectedTupleObject]:
        getInjectedArgFromType<InjectedTupleObject[i]>
}

export type getInjectedArgsFromInjectedTuple<InjectTuple> =
    Array<any> & getInjectedArgsFromInjectedTupleObject<
        getObjectFromTuple<InjectTuple>
    >;

export type getInterfacesTupleFromImplementsTuple<ImplementsTuple> = {
    [i in keyof ImplementsTuple]: getInterfaceFromType<ImplementsTuple[i]>
}

export type getInterfaceExtendingInterfacesTuple<InterfacesTuple> =
    UnionToIntersection<
        InterfacesTuple[keyof getObjectFromTuple<InterfacesTuple>]
    >;

export type getInterfaceFromImplementsTuple<ImplementsTuple> =
    getInterfaceExtendingInterfacesTuple<
        getInterfacesTupleFromImplementsTuple<ImplementsTuple>
    >;

export type getInjectedArgFromType<T> =
    T extends Type<infer Interface> ? Interface :
    T extends TypeMulti<infer Interface> ? Interface[] :
    T extends TypeLazy<infer Interface> ? Lazy<Interface> :
    T extends TypeMultiLazy<infer Interface> ? Lazy<Interface[]> :
    never;

export type getObjectFromTuple<T> = {
    [i in Exclude<keyof T, keyof []>]: T[i]
}

export type UserClass<
    UserConstructorArgs extends getInjectedArgsFromInjectedTuple<InjectTuple>,
    UserInstanceType extends getInterfaceFromImplementsTuple<ImplementsTuple>,
    ImplementsTuple extends Array<Type<any>>,
    InjectTuple extends Array<TypeInjected<any>>,
> = NewableUserClass<UserInstanceType, UserConstructorArgs>;

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
> = InjectedClassFromInterface<
    UserInstanceType,
    InjectedClassArguments<UserConstructorArgs, InjectTuple>
>;

export type ImplementedTypes = Array<Type<any>>;

export type InjectedTypes = Array<TypeInjected<any>>;

export type DependencyConfiguration = {
    scope: Scope,
    implementedTypes: ImplementedTypes,
    injectedTypes: InjectedTypes
}