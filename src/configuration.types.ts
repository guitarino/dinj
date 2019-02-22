import { ImplementationScope } from "./implementationsContainer.types";

export type ContainerConfiguration = {
    defaultScope: ImplementationScope,
    showCircularDependencyError: boolean,
    showLazyPotentialCircularWarning: boolean
    showSingletonPotentialCircularWarning: boolean
};