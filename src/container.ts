import {
    TypeIdentifierMap,
    TImplementationMap,
    TDependencies,
    TImplementationScope,
    TConfiguration,
    TAnyImplementation,
    TDependencyDescriptor,
    TContainerInternal,
    TTypeIdentifier,
    TAnyTypeIdentifier
} from "./types";
import { createTypeIdentifier } from "./typeIdentifier";
import { createLazy } from "./lazy";
import { createConfiguration } from "./configuration";


export function createContainer(userConfiguration: Partial<TConfiguration> = {}) {
    const configuration = createConfiguration(userConfiguration);

}
