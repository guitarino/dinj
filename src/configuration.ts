import { createInjectedClass } from "./injection";
import { registerInjectedClass } from "./type";
import { CreateConfigureDependencyReturn } from "./configuration.types";
import { ContainerConfiguration } from "./container.types";

export function createConfigureDependency(containerConfiguration: ContainerConfiguration): CreateConfigureDependencyReturn {
    return function configureDependency(configuration = {
        implements: [],
        inject: [],
        scope: undefined
    }) {
        return {
            implements(...implementedTypes) {
                return configureDependency({
                    implements: implementedTypes,
                    inject: configuration.inject,
                    scope: configuration.scope
                });
            },
            inject(...injectedTypes) {
                return configureDependency({
                    implements: configuration.implements,
                    inject: injectedTypes,
                    scope: configuration.scope
                });
            },
            scope(scope) {
                return configureDependency({
                    implements: configuration.implements,
                    inject: configuration.inject,
                    scope: scope
                });
            },
            create(userClass) {
                const injectedClass = createInjectedClass(userClass, configuration.scope, containerConfiguration.defaultScope, configuration.inject);
                registerInjectedClass(injectedClass, configuration.implements);
                return injectedClass;
            }
        };
    }
}