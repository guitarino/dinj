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

export type Scope = 'singleton' | 'transient' | undefined;

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

export type getConstructorArgsFromInjectedTupleObject<InjectedTupleObject> = {
    [i in keyof InjectedTupleObject]: getConstructorArgFromType<InjectedTupleObject[i]>
}

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
}

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

export type InjectedClass<
    UserConstructorArgs extends getConstructorArgsFromInjectedTuple<InjectTuple>,
    UserInstanceType extends getInterfaceFromImplementsTuple<ImplementsTuple>,
    ImplementsTuple extends Array<Type<any>>,
    InjectTuple extends Array<TypeInjected<any>>
> = {
    new(...args: UserConstructorArgs): UserInstanceType;
}

export type DependencyReturn<
    CurrentScope extends Scope = undefined,
    CurrentImplementsTuple extends Array<Type<any>> = [],
    CurrentInjectTuple extends Array<TypeInjected<any>> = [],
> = {
    implements: <ImplementsTuple extends Array<any>>(...implementedTypes: ImplementsTuple) =>
        DependencyReturn<CurrentScope, ImplementsTuple, CurrentInjectTuple>;

    inject: <InjectTuple extends Array<any>>(...injectedTypes: InjectTuple) =>
        DependencyReturn<CurrentScope, CurrentImplementsTuple, InjectTuple>;

    scope: <NewScope extends Scope>(scope: Scope) =>
        DependencyReturn<NewScope, CurrentImplementsTuple, CurrentInjectTuple>;

    from: <
        UserConstructorArgs extends getConstructorArgsFromInjectedTuple<CurrentInjectTuple>,
        UserInstanceType extends getInterfaceFromImplementsTuple<CurrentImplementsTuple>
    >(
        clss: UserClass<UserConstructorArgs, UserInstanceType, CurrentImplementsTuple, CurrentInjectTuple>
    ) =>
        InjectedClass<UserConstructorArgs, UserInstanceType, CurrentImplementsTuple, CurrentInjectTuple>;
}

export function createDependencyConfigurator(container: Container) {

    return function dependency(): DependencyReturn {
        var x: any;
        return x;
    }
}

/////////////////////////////////////////////////////////

function magic(): any {}

const createDependency = createDependencyConfigurator({});

export class A implements IA, IC, ID {
    haha: 'blabla' = 'blabla';
    b: Lazy<IB[]>;
    x: number;

    constructor(b: Lazy<IB[]>, x: number) {
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
interface ID {
    haha: 'blabla'
};

const InjectedA = createDependency()
    .implements(IA, IC, ID)
    .inject(IB.multi.lazy)
    .scope('transient')
    .from(A)
;

const ia = new InjectedA(100000);

export type Y = { 0: 'asd', 1: 'dsa' };

export type Z = ['asd', 'dsa', 'bdsa' ];

export type X = Z extends Y ? 'yes' : 'no';

type A1 = getConstructorArgsFromInjectedTuple<[TypeMultiLazy<IB>, TypeLazy<IA>]>;

type A2 = A1[1];