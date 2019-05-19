import { InjectedClassFromInterface } from "./injection.types";

export type Type<Interface> = {
    isMulti: false,
    isLazy: false,
    multi: TypeMulti<Interface>,
    lazy: TypeLazy<Interface>,
    implementations: Array<InjectedClassFromInterface<Interface>>,
    descendents: Array<Type<Partial<Interface>>>
}

export type TypeMulti<Interface> = {
    isMulti: true,
    isLazy: false,
    lazy: TypeMultiLazy<Interface>,
    implementations: Array<InjectedClassFromInterface<Interface>>
}

export type TypeLazy<Interface> = {
    isMulti: false,
    isLazy: true,
    multi: TypeMultiLazy<Interface>,
    implementations: Array<InjectedClassFromInterface<Interface>>
}

export type TypeMultiLazy<Interface> = {
    isMulti: true,
    isLazy: true,
    implementations: Array<InjectedClassFromInterface<Interface>>
}