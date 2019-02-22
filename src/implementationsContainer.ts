import { ContainerConfiguration } from "./configuration.types";
import { ImplementationById, AnyImplementation, ImplementationScope } from "./implementationsContainer.types";
import { TypeIdentifierById, TypeIdentifier } from "./typeContainer.types";
import { TYPE_ID } from "./typeContainer.cnst";
import { IS_SINGLETON } from "./implementationsContainer.cnst";

export function createImplementationsContainer(
    configuration: ContainerConfiguration,
    typeIdentifiersById: TypeIdentifierById
) {
    const implementationsById: ImplementationById = {};

    function addImplementation(id: string, implementation: AnyImplementation) {
        if (!implementationsById[id]) {
            implementationsById[id] = [];
        }
        implementationsById[id].push(implementation);
    }

    function registerImplementation(id: string, implementation: AnyImplementation, userScope?: ImplementationScope) {
        const scope = userScope ? userScope : configuration.defaultScope;
        implementation[TYPE_ID] = id;
        if (scope === 'singleton') {
            implementation[IS_SINGLETON] = true;
        }
        const children = typeIdentifiersById[id];
        addImplementation(id, implementation);
        if (children) {
            for (let i = 0; i < children.length; i++) {
                addImplementation(children[i], implementation);
            }
        }
    }

    function getImplementation<T>(type: TypeIdentifier<T>): AnyImplementation {
        return getImplementations(type)[0];
    }

    function getImplementations<T>(type: TypeIdentifier<T>): AnyImplementation[] {
        return implementationsById[type.id];
    }

    return {
        implementationsById,
        getImplementation,
        getImplementations,
        registerImplementation
    }
}