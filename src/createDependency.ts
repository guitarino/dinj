export type Container = {

}

export type GenericInterface<ConstructorArgs extends Array<any>, InstanceType> = {
    new(...args: ConstructorArgs): InstanceType
}

export type Type<Interface> = {
    isMulti: false,
    isLazy: false,
    multi: TypeMulti<Interface>,
    lazy: TypeLazy<Interface>
}

export type TypeMulti<Interface> = {
    isMulti: true,
    isLazy: false,
    lazy: TypeMultiLazy<Interface>
}

export type TypeLazy<Interface> = {
    isMulti: false,
    isLazy: true,
    multi: TypeMultiLazy<Interface>
}

export type TypeMultiLazy<Interface> = {
    isMulti: true,
    isLazy: true
}

export type Scope = 'singleton' | 'transient';

export type Lazy<T> = {
    value: T
}

export type TypeInjected<Interface> =
    Type<Interface> |
    TypeMulti<Interface> |
    TypeLazy<Interface> |
    TypeMultiLazy<Interface>;

export type getInterfaceFromType<T> =
    T extends Type<infer Interface> ? Interface :
    never;

export type getConstructorArgsFromInjectedTuple<InjectTuple> = {
    [i in keyof InjectTuple]: getConstructorArgFromType<InjectTuple[i]>
}

export type getInterfacesTupleFromImplementsTuple<ImplementsTuple> = {
    [i in keyof ImplementsTuple]: getInterfaceFromType<ImplementsTuple[i]>
}

export type UnionToIntersection<Union> = (
    Union extends any
        ? (argument: Union) => void
        : never
) extends (argument: infer Intersection) => void
    ? Intersection
    : never;

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
}

export type UserClass<
    UserConstructorArgs extends getConstructorArgsFromInjectedTuple<InjectTuple>,
    UserInstanceType extends getInterfaceFromImplementsTuple<ImplementsTuple>,
    ImplementsTuple extends Array<Type<any>>,
    InjectTuple extends Array<TypeInjected<any>>,
> = {
    new(...args: UserConstructorArgs): UserInstanceType;
}

export type DependencyConfiguration<
    UserConstructorArgs extends getConstructorArgsFromInjectedTuple<InjectTuple>,
    UserInstanceType extends getInterfaceFromImplementsTuple<ImplementsTuple>,
    ImplementsTuple extends Array<Type<any>>,
    InjectTuple extends Array<TypeInjected<any>>,
> = {
    scope?: Scope,
    implements?: ImplementsTuple,
    inject: InjectTuple,
    class: UserClass<UserConstructorArgs, UserInstanceType, ImplementsTuple, InjectTuple>
}

export function getCreateDependency(container: Container) {

    return function createDependency<
        UserConstructorArgs extends getConstructorArgsFromInjectedTuple<InjectTuple>,
        UserInstanceType extends getInterfaceFromImplementsTuple<ImplementsTuple>,
        ImplementsTuple extends Array<Type<any>>,
        InjectTuple extends Array<TypeInjected<any>>,
    >(dependencyConfiguration: DependencyConfiguration<
        UserConstructorArgs,
        UserInstanceType,
        ImplementsTuple,
        InjectTuple
    >) {

    }
}

/////////////////////////////////////////////////////////

function magic(): any {}

const createDependency = getCreateDependency({});

export class A implements IA, IC, ID {
    b: Lazy<IB[]>;
    x: string;

    constructor(b: Lazy<IB[]>, x: string) {
        this.b = b;
        this.x = x;
    }
}

const IA: Type<IA> = magic();
interface IA {};
const IB: Type<IB> = magic();
interface IB {};
const IC: Type<IC> = magic();
interface IC {};
const ID: Type<ID> = magic();
interface ID {};

const InjectedA = createDependency({
    implements: [IA, IC, ID],
    inject: [IB.multi.lazy],
    class: A
});

// export type Y = getObjectFromTuple<['asd', 'dsa']>;

// export type Z = getObjectFromTuple<['asd', 'dsa', 'bdsa']>;

// export type X = Z extends Y ? 'yes' : 'no';