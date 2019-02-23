import { ContainerConfiguration } from "./configuration.types";
import { createConfiguration } from "./configuration";
import { createTypeContainer } from "./typeContainer";
import { createImplementationsContainer } from "./implementationsContainer";
import { createDependenciesContainer } from "./dependenciesContainer";
import { circularDependencyDetector } from "./circularDependencyDetector";
import { Container, ContainerInternal } from "./container.types";

export function createContainer(userConfiguration: Partial<ContainerConfiguration> = {}): Container {
    const {
        configuration,
        configure
    } = createConfiguration();

    const {
        typeIdentifiersById,
        type,
        typeName,
        generateUniqueImplementationTypeName,
        generateUniqueTypeName
    } = createTypeContainer(configuration);

    const {
        implementationsById,
        getImplementation,
        getImplementations,
        registerImplementation
    } = createImplementationsContainer(
        configuration,
        typeIdentifiersById
    );

    const {
        dependenciesById,
        getConstructorArgs,
        registerDependencies,
        get
    } = createDependenciesContainer(implementationsById);

    const {
        hasCircularDependencies
    } = circularDependencyDetector(
        configuration,
        implementationsById,
        dependenciesById
    );

    const container: ContainerInternal = {
        configure,
        type,
        typeName,
        generateUniqueImplementationTypeName,
        generateUniqueTypeName,
        getImplementation,
        getImplementations,
        registerImplementation,
        getConstructorArgs,
        registerDependencies,
        get,
        hasCircularDependencies
    };

    configure(userConfiguration);

    return container;
}
