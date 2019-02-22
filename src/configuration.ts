import { TConfiguration } from "./configuration.types";

export function createConfiguration(configuration: Partial<TConfiguration>): TConfiguration {
    return {
        defaultScope:
            configuration.defaultScope != null ?
            configuration.defaultScope :
            'transient',
        showCircularDependencyError:
            configuration.showCircularDependencyError != null ?
            configuration.showCircularDependencyError :
            true,
        showLazyPotentialCircularWarning:
            configuration.showLazyPotentialCircularWarning != null ?
            configuration.showLazyPotentialCircularWarning :
            false,
        showSingletonPotentialCircularWarning:
            configuration.showSingletonPotentialCircularWarning != null ?
            configuration.showSingletonPotentialCircularWarning :
            true
    }
}