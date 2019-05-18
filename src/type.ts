import { Type, TypeMultiLazy, TypeMulti, TypeLazy } from "./type.types";
import { InjectedClassFromInterface, ImplementedTypes } from "./injection.types";

export function registerInjectedClass<Interface>(InjectedClass: InjectedClassFromInterface<Interface>, implementedTypes: ImplementedTypes) {
    forEachTypeAndDescendent<Interface>(implementedTypes, function addImplementation(combinedType: Type<Partial<Interface>>) {
        if (combinedType.implementations.indexOf(InjectedClass) < 0) {
            combinedType.implementations.push(InjectedClass);
        }
    });
}

export function type<Interface>(...childTypes: Array<Type<Partial<Interface>>>): Type<Interface> {
    const implementations = [];

    const multiLazy: TypeMultiLazy<Interface> = {
        isMulti: true,
        isLazy: true,
        implementations
    };

    const multi: TypeMulti<Interface> = {
        isMulti: true,
        isLazy: false,
        implementations,
        lazy: multiLazy
    };

    const lazy: TypeLazy<Interface> = {
        isMulti: false,
        isLazy: true,
        implementations,
        multi: multiLazy
    };

    return {
        isMulti: false,
        isLazy: false,
        multi,
        lazy,
        implementations,
        descendents: getTypeDescendents<Interface>(childTypes)
    }
}

function getTypeDescendents<Interface>(childTypes: Array<Type<Partial<Interface>>>): Array<Type<Partial<Interface>>> {
    const descendents: Array<Type<Partial<Interface>>> = [];
    forEachTypeAndDescendent<Partial<Interface>>(childTypes, (childOrDescendent) => {
        const descendent: Type<Partial<Interface>> = childOrDescendent as Type<Partial<Interface>>;
        if (descendents.indexOf(descendent) < 0) {
            descendents.push(descendent);
        }
    });
    return descendents;
}

function forEachTypeAndDescendent<Interface>(
    types: Array<Type<Interface>>,
    callback: (combinedType: Type<Partial<Interface>>) => void
) {
    for (let i = 0; i < types.length; i++) {
        const type = types[i];
        callback(type);
        const descendents = type.descendents;
        for (let i = 0; i < descendents.length; i++) {
            const descendent = descendents[i];
            callback(descendent);
        }
    }
}