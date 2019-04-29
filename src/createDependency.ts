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

export type TypeInjected<Interface> = Type<Interface> | TypeLazy<Interface> | TypeMultiLazy<Interface>;

export type Scope = 'singleton' | 'transient';

export type Lazy<T> = {
    value: T
}

export type getInjectedArgFromType<T> =
    T extends Type<infer Interface> ? Interface :
    T extends TypeMulti<infer Interface> ? Interface[] :
    T extends TypeLazy<infer Interface> ? Lazy<Interface> :
    T extends TypeMultiLazy<infer Interface> ? Lazy<Interface[]> :
    never;

export type getObjectFromTuple<T> = {
    [i in Exclude<keyof T, keyof []>]: T[i]
}

export type UserClass<UserConstructorArgs extends Array<any>, UserInstanceType> = {
    new(...args: UserConstructorArgs): UserInstanceType;
}

export type DependencyConfiguration<
    UserConstructorArgs extends Array<any>,
    UserInstanceType,
    ImplementsTuple extends Array<TypeInjected<any>>,
    InjectTuple extends Array<TypeInjected<any>>
> = {
    scope?: Scope,
    implements?: ImplementsTuple,
    inject: InjectTuple,
    class: UserClass<UserConstructorArgs, UserInstanceType>
}

export function getCreateDependency(container: Container) {

    return function createDependency<
        UserConstructorArgs extends Array<any>,
        UserInstanceType,
        ImplementsTuple extends Array<Type<any>>,
        InjectTuple extends Array<TypeInjected<any>>
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
    b: IB[];
    x: string;

    constructor(b: IB[], x: string) {
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