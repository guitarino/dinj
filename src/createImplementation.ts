import { TAnyImplementation, TSetup, TDependencyUserDescriptor, TImplementationScope, TContainerInternal } from "./types";

function createClassWithSetup(c: TAnyImplementation, setup: TSetup): TAnyImplementation {
    return class extends c {
        constructor(...args) {
            super(...args, setup);
            if (!this._dinjSetupCalled) {
                setup(this);
            }
        }
    }
}

export function createImplementation(
    container: TContainerInternal,
    id: string,
    dependencies: TDependencyUserDescriptor[],
    c: TAnyImplementation,
    scope?: TImplementationScope
): TAnyImplementation {
    const cName = c.name ? c.name : id;
    const implementation = ({
        [cName]: createClassWithSetup(c, function (instance) {
            container.getSelf(id, instance);
            instance._dinjSetupCalled = true;
        })
    })[cName];
    container.transferStaticProperties(c, implementation);
    container.registerDependencies(id, dependencies);
    container.registerImplementation(id, implementation, scope);
    return implementation;
}