import { DEP_NAME } from "./inject";
import { TContainerInternal, TTypeIdentifier, TScopedTypeIdentifier, TImplementationScope, TAnyImplementation, Klass } from "../types";
import { createImplementation } from "../createImplementation";

export function createDependencyDecorator(container: TContainerInternal) {
    return function dependency<TInterface>(type: TTypeIdentifier<TInterface> | TScopedTypeIdentifier<TInterface, TImplementationScope>) {
        return function<T extends any[]>(klass: Klass<T>): any {
            const userDependencies = klass[DEP_NAME] || [];
            delete klass[DEP_NAME];
            return createImplementation(
                container,
                type.id,
                userDependencies,
                klass as any as TAnyImplementation,
                type.scope
            );
        }
    }
}