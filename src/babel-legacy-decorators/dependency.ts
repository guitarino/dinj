import { DEP_NAME } from "./inject";
import { TContainerInternal, TAnyImplementation, Klass, TDependencyDecoratorIdentifierArg } from "../types";
import { createImplementation } from "../createImplementation";

export function createDependencyDecorator(container: TContainerInternal) {
    return function dependency<TInterface>(userType: TDependencyDecoratorIdentifierArg<TInterface>) {
        return function<T extends any[]>(klass: Klass<T>): any {
            const userDependencies = klass[DEP_NAME] || [];
            delete klass[DEP_NAME];
            createImplementation(
                container,
                userType,
                userDependencies,
                klass as any as TAnyImplementation
            );
        }
    }
}