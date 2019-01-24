import { TAnyImplementation, TDependencyDescriptor, TContainerInternal, TDependencyDecoratorIdentifierArg } from "./types";

export function createImplementation<TInterface>(
    container: TContainerInternal,
    userType: TDependencyDecoratorIdentifierArg<TInterface>,
    dependencies: TDependencyDescriptor[],
    klass: TAnyImplementation
): TAnyImplementation {
    const type = container.typeName(
        container.generateUniqueImplementationTypeName(klass.name || ''),
        { id: userType.id }
    );
    container.registerDependencies(type.id, dependencies);
    class Dependency extends klass {
        constructor(...args) {
            const depArgs = container.getConstructorArgs(type.id);
            super(...depArgs, ...args);
        }
    };
    container.transferStaticProperties(klass, Dependency);
    container.registerImplementation(type.id, Dependency, userType.scope);
    return Dependency;
}