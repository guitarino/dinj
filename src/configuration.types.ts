import { TImplementationScope } from "./implementationsContainer.types";

export type TConfiguration = {
    defaultScope: TImplementationScope,
    showCircularDependencyError: boolean,
    showLazyPotentialCircularWarning: boolean
    showSingletonPotentialCircularWarning: boolean
};