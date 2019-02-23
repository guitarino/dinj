import { createTypeIdentifier } from "./typeIdentifier";
import { TypeIdentifierById, AnyTypeIdentifier, TypeIdentifier } from "./typeContainer.types";
import { ContainerConfiguration } from "./configuration.types";

export function createTypeContainer(configuration: ContainerConfiguration) {
    let typeIndex: number = 0;
    const typeIdentifiersById: TypeIdentifierById = {};
    
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

    function type<T>(...children: AnyTypeIdentifier[]): TypeIdentifier<T> {
        const id = generateUniqueTypeName();
        return typeName(id, ...children);
    }

    function typeName<T>(id: string, ...children: AnyTypeIdentifier[]): TypeIdentifier<T> {
        const childrenIds: string[] = [];
        for (let i = 0; i < children.length; i++) {
            childrenIds.push(children[i].id);
        }
        const type = createTypeIdentifier(id, false, false, configuration.defaultScope);
        addTypeIdentifier(id, childrenIds);
        return type;
    }

    return {
        typeIdentifiersById,
        type,
        typeName,
        generateUniqueImplementationTypeName,
        generateUniqueTypeName
    }
}