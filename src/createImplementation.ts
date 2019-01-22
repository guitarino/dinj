import { TAnyImplementation, TDependencyDescriptor, TImplementationScope, TContainerInternal } from "./types";

export function createImplementation(
    container: TContainerInternal,
    id: string,
    dependencies: TDependencyDescriptor[],
    klass: TAnyImplementation,
    userScope: TImplementationScope
): TAnyImplementation {
    container.registerScope(id, userScope);
    container.registerDependencies(id, dependencies);
    class Dependency extends klass {
        constructor(...args) {
            const depArgs = container.getConstructorArgs(id);
            super(...depArgs, ...args);
        }
    };
    container.transferStaticProperties(klass, Dependency);
    container.registerImplementation(id, Dependency);
    return Dependency;
}