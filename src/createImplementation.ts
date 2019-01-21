import { TAnyImplementation, TDependencyDescriptor, TImplementationScope, TContainerInternal } from "./types";

export function createImplementation(
    container: TContainerInternal,
    id: string,
    dependencies: TDependencyDescriptor[],
    klass: TAnyImplementation,
    scope: TImplementationScope
): TAnyImplementation {
    const name = klass.name || id;
    container.registerScope(id, scope);
    container.registerDependencies(id, dependencies);
    class Dependency extends klass {
        constructor(...args) {
            const depArgs = container.getConstructorArgs(id);
            super(...depArgs, ...args);
        }
    };
    container.transferStaticProperties(klass, Dependency);
    container.registerImplementation(id, Dependency);
    // return klass;
    return Dependency;
}