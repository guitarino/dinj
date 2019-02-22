import { DEP_NAME } from "./inject";
import { createImplementation } from "../createImplementation";
import { ContainerInternal } from "../container.types";
import { DependencyDecoratorIdentifierArg, ImplementationWithArgs } from "../decorators.types";
import { AnyImplementation } from "../implementationsContainer.types";

export function createDependencyDecorator(container: ContainerInternal) {
    return function dependency<T>(userType: DependencyDecoratorIdentifierArg<T>) {
        return function<T extends any[]>(userImplementation: ImplementationWithArgs<T>): any {
            const userDependencies = userImplementation[DEP_NAME] || [];
            delete userImplementation[DEP_NAME];
            createImplementation(
                container,
                userType,
                userDependencies,
                userImplementation as any as AnyImplementation
            );
        }
    }
}