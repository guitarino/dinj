import { TAnyImplementation, TSetup, TDependencyUserDescriptor, TImplementationScope, TContainerInternal } from "./types";

function createClassWithSetup(id: string, c: TAnyImplementation, setup: TSetup): any {
    const cName = c.name ? c.name : id;
    const implementation = ({
        [cName]: function(...args) {
            setup(this);
            // issue with this is that we c.apply defines a property, but setup (getSelf) does too
            c.apply(this, args);
        }
    })[cName];
    implementation.prototype = Object.create(c.prototype);
    return implementation;
}

export function createImplementation(
    container: TContainerInternal,
    id: string,
    dependencies: TDependencyUserDescriptor[],
    c: TAnyImplementation,
    scope?: TImplementationScope
): TAnyImplementation {
    container.registerScope(id, scope);
    container.registerDependencies(id, dependencies);
    const implementation = createClassWithSetup(id, c, function (instance) {
        container.getSelf(id, instance);
    });
    container.transferStaticProperties(c, implementation);
    container.registerImplementation(id, implementation);
    return implementation;
}