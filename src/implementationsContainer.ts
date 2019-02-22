import { TConfiguration } from "./configuration.types";
import { TImplementationMap, TAnyImplementation, TImplementationScope } from "./implementationsContainer.types";
import { TypeIdentifierMap, TTypeIdentifier } from "./typeContainer.types";
import { TYPE_ID } from "./typeContainer.cnst";
import { IS_SINGLETON } from "./implementationsContainer.cnst";

export function createImplementationsContainer(
    configuration: TConfiguration,
    typeIdentifiersById: TypeIdentifierMap
) {
    const implementationsById: TImplementationMap = {};

    function addImplementation(id: string, implementation: TAnyImplementation) {
        if (!implementationsById[id]) {
            implementationsById[id] = [];
        }
        implementationsById[id].push(implementation);
    }

    function registerImplementation(id: string, implementation: TAnyImplementation, userScope?: TImplementationScope) {
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

    function getImplementation<T>(type: TTypeIdentifier<T>): TAnyImplementation {
        return getImplementations(type)[0];
    }

    function getImplementations<T>(type: TTypeIdentifier<T>): TAnyImplementation[] {
        return implementationsById[type.id];
    }
}