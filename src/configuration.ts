import { ContainerConfiguration } from "./configuration.types";

export function createConfiguration() {
    const configuration: ContainerConfiguration = {
        defaultScope: 'transient',
        showCircularDependencyError: true,
        showLazyPotentialCircularWarning: false,
        showSingletonPotentialCircularWarning: true
    };

    function configure(userConfiguration: Partial<ContainerConfiguration>) {
        if (userConfiguration.defaultScope != null) {
            configuration.defaultScope = userConfiguration.defaultScope;
        }
        if (userConfiguration.showCircularDependencyError != null) {
            configuration.showCircularDependencyError = userConfiguration.showCircularDependencyError;
        }
        if (userConfiguration.showLazyPotentialCircularWarning != null) {
            configuration.showLazyPotentialCircularWarning = userConfiguration.showLazyPotentialCircularWarning;
        }
        if (userConfiguration.showSingletonPotentialCircularWarning != null) {
            configuration.showSingletonPotentialCircularWarning = userConfiguration.showSingletonPotentialCircularWarning;
        }
    }

    return {
        configuration,
        configure
    }
}