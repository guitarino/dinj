import { ContainerInternal } from "./container.types";
import { DependencyDecoratorIdentifierArg } from "./decorators.types";
import { DependencyDescriptor } from "./dependenciesContainer.types";
import { AnyImplementation } from "./implementationsContainer.types";

export function createImplementation<T>(
    container: ContainerInternal,
    userType: DependencyDecoratorIdentifierArg<T>,
    dependencies: DependencyDescriptor[],
    userImplementation: AnyImplementation
): AnyImplementation {
    const type = container.typeName(
        container.generateUniqueImplementationTypeName(userImplementation.name || ''),
        { id: userType.id }
    );
    container.registerDependencies(type.id, dependencies);
    class Dependency extends userImplementation {
        constructor(...args) {
            const depArgs = container.getConstructorArgs(type.id);
            super(...depArgs, ...args);
        }
    };
    container.registerImplementation(type.id, Dependency, userType.scope);
    return Dependency;
}