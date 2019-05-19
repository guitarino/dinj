import { createConfigureDependency } from "./configuration";
import { type } from "./type";
import { Type } from "./type.types";
import { ContainerConfiguration, Container } from "./container.types";
import { get } from "./injection";

export const defaultContainerConfiguration: ContainerConfiguration = {
    defaultScope: 'singleton'
}

export function createContainer(containerConfiguration: ContainerConfiguration = defaultContainerConfiguration): Container {
    const types: Array<Type<any>> = [];
    return {
        types,
        configureDependency: createConfigureDependency(containerConfiguration),
        get: get,
        type(...childTypes) {
            const collectedType = type(...childTypes);
            types.push(collectedType);
            return collectedType;
        }
    };
}