import { AnyImplementation, ImplementationScope } from "./implementationsContainer.types";
import { DependencyDescriptor } from "./dependenciesContainer.types";
import { AnyTypeIdentifier, TypeIdentifier } from "./typeContainer.types";
import { ContainerConfiguration } from "./configuration.types";

export interface ContainerInternal extends Container {
    generateUniqueImplementationTypeName: (name: string) => string,
    generateUniqueTypeName: () => string,
    registerImplementation: (id: string, implementation: AnyImplementation, userScope?: ImplementationScope) => void,
    registerDependencies: (id: string, userDependencies: DependencyDescriptor[]) => void,
    getConstructorArgs: (id: string) => any[],
};

export interface Container {
    configure: (configuration: Partial<ContainerConfiguration>) => void,
    type: <T>(...children: AnyTypeIdentifier[]) => TypeIdentifier<T>,
    typeName: <T>(name: string, ...children: AnyTypeIdentifier[]) => TypeIdentifier<T>,
    getImplementation: <T>(type: TypeIdentifier<T>) => AnyImplementation,
    getImplementations: <T>(type: TypeIdentifier<T>) => AnyImplementation[],
    get: <T>(type: TypeIdentifier<T>, ...args: any[]) => T,
    hasCircularDependencies: () => boolean
};