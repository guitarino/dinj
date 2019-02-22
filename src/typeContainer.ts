import { createTypeIdentifier } from "./typeIdentifier";
import { TypeIdentifierMap, TAnyTypeIdentifier, TTypeIdentifier } from "./typeContainer.types";
import { TConfiguration } from "./configuration.types";

export function createTypeContainer(configuration: TConfiguration) {
    let typeIndex: number = 0;
    const typeIdentifiersById: TypeIdentifierMap = {};
    
    function addTypeIdentifier(id: string, children: string[]) {
        if (!typeIdentifiersById[id]) {
            typeIdentifiersById[id] = [];
        }
        const typeIdentifiers = typeIdentifiersById[id];
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const grandchildren = typeIdentifiersById[child];
            if (!~typeIdentifiers.indexOf(child)) {
                typeIdentifiers.push(child);
            }
            if (grandchildren) {
                addTypeIdentifier(id, grandchildren);
            }
        }
    }

    function generateUniqueImplementationTypeName(name?: string): string {
        return `${generateUniqueTypeName()}${name ? `(${name})` : ``}`;
    }

    function generateUniqueTypeName(): string {
        return `_typeinjectType${typeIndex++}`;
    }

    function type<T>(...children: TAnyTypeIdentifier[]): TTypeIdentifier<T> {
        const id = generateUniqueTypeName();
        return typeName(id, ...children);
    }

    function typeName<T>(id: string, ...children: TAnyTypeIdentifier[]): TTypeIdentifier<T> {
        const childrenIds: string[] = [];
        for (let i = 0; i < children.length; i++) {
            childrenIds.push(children[i].id);
        }
        const type = createTypeIdentifier(id, false, false, configuration.defaultScope);
        addTypeIdentifier(id, childrenIds);
        return type;
    }
}