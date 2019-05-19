import { createConfigureDependency } from "./configuration";
import { type } from "./type";
import { Type } from "./type.types";
import { ContainerConfiguration } from "./container.types";

export const defaultContainerConfiguration: ContainerConfiguration = {
    defaultScope: 'singleton'
}

export function createContainer(containerConfiguration: ContainerConfiguration = defaultContainerConfiguration) {
    const types: Array<Type<any>> = [];
    return {
        types,
        type: function<Interface>(...childTypes: Array<Type<Partial<Interface>>>): Type<Interface> {
            const collectedType = type<Interface>(...childTypes);
            types.push(collectedType);
            return collectedType;
        },
        configureDependency: createConfigureDependency(containerConfiguration),
    };
}