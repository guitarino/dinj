import { InjectedTypes, getInjectedArgsFromInjectedTuple, TypeInjected, InjectedClassFromInterface, NewableUserClass, Scope } from "./injection.types";
import { createLazy } from "./lazy";

export function createInjectedClass<UserClassType extends NewableUserClass>(ProvidedClass: UserClassType, providedScope: Scope | undefined, defaultScope: Scope, injectedTypes: InjectedTypes): InjectedClassFromInterface {
    return class InjectedClass extends ProvidedClass {
        static scope: Scope = providedScope || defaultScope;
        static instance: InjectedClass;
        static userClass: NewableUserClass = ProvidedClass;
        static injectedTypes: InjectedTypes = injectedTypes;
        
        constructor(...args) {
            const dependencies = getInjectedArguments(injectedTypes);
            super(...dependencies, ...args);
            if (providedScope === 'singleton' && !InjectedClass.instance) {
                InjectedClass.instance = this;
            }
        }
    };
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

function getSingle<I>(injectedType: TypeInjected<I>, index: number, args: any[]): I {
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