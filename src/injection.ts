import { InjectedTypes, getInjectedArgsFromInjectedTuple, TypeInjected, InjectedClassFromInterface, NewableUserClass, Scope } from "./injection.types";
import { createLazy } from "./lazy";
import { Type } from "./type.types";

export function createInjectedClass<UserClassType extends NewableUserClass>(ProvidedClass: UserClassType, providedScope: Scope | undefined, defaultScope: Scope, injectedTypes: InjectedTypes): InjectedClassFromInterface {
    const scope: Scope = providedScope || defaultScope;
    return class InjectedClass extends ProvidedClass {
        static scope: Scope = scope;
        static instance: InjectedClass;
        static userClass: NewableUserClass = ProvidedClass;
        static injectedTypes: InjectedTypes = injectedTypes;
        
        constructor(...args) {
            const dependencies = getInjectedArguments(injectedTypes);
            super(...dependencies, ...args);
            if (scope === 'singleton' && !InjectedClass.instance) {
                InjectedClass.instance = this;
            }
        }
    };
}

export function get<Interface>(type: Type<Interface>, ...args: Array<any>): Interface {
    return getSingle(type, 0, args);
}

function getInjectedArguments<InjectTuple extends InjectedTypes>(injectedTypes: InjectTuple): getInjectedArgsFromInjectedTuple<InjectTuple> {
    const injectedArgs: getInjectedArgsFromInjectedTuple<InjectTuple> = [] as any;
    for(let i = 0; i < injectedTypes.length; i++) {
        const injectedType = injectedTypes[i];
        const getter = createDependencyGetter(injectedType);
        if (injectedType.isLazy) {
            injectedArgs.push(createLazy(getter));
        }
        else {
            injectedArgs.push(getter());
        }
    }
    return injectedArgs;
}

function createDependencyGetter<I>(injectedType: TypeInjected<I>) {
    return function injectedGetter(): I | I[] {
        if (injectedType.isMulti) {
            return getMulti(injectedType);
        }
        else {
            return getSingle(injectedType, 0, []);
        }
    }
}

function getSingle<I>(injectedType: TypeInjected<I>, index: number, args: Array<any>): I {
    const implementation = injectedType.implementations[index];
    const instance = implementation.scope === 'singleton' && implementation.instance
        ? implementation.instance
        : new implementation(...args);
    return instance;
}

function getMulti<I>(injectedType: TypeInjected<I>): I[] {
    const implementationCount = injectedType.implementations.length;
    const instances: I[] = [];
    for (let i = 0; i < implementationCount; i++) {
        instances.push(getSingle(injectedType, i, []));
    }
    return instances;
}