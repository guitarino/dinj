import { ImplementedTypes, InjectedTypes, getInjectedArgsFromInjectedTuple, getInterfaceFromImplementsTuple, UserClass } from "./injection.types";
import { createInjectedClass } from "./injection";
import { registerInjectedClass } from "./type";
import { ContainerConfiguration, Scope } from "./configuration.types";

export function createConfigureDependency(containerConfiguration: ContainerConfiguration) {
    return function configureDependency<
        CurrentScope extends Scope | undefined = undefined,
        CurrentImplementsTuple extends ImplementedTypes = [],
        CurrentInjectTuple extends InjectedTypes = []
    >(configuration: {
        implements: CurrentImplementsTuple | [],
        inject: CurrentInjectTuple | [],
        scope: CurrentScope | undefined
    } = {
        implements: [],
        inject: [],
        scope: undefined
    }) {
        return {
            implements<ImplementsTuple extends ImplementedTypes>(...implementedTypes: ImplementsTuple) {
                return configureDependency({
                    implements: implementedTypes,
                    inject: configuration.inject,
                    scope: configuration.scope
                });
            },
            inject<InjectTuple extends InjectedTypes>(...injectedTypes: InjectTuple) {
                return configureDependency({
                    implements: configuration.implements,
                    inject: injectedTypes,
                    scope: configuration.scope
                });
            },
            scope<NewScope extends Scope>(scope: NewScope) {
                return configureDependency({
                    implements: configuration.implements,
                    inject: configuration.inject,
                    scope: scope
                });
            },
            create<UserConstructorArgs extends getInjectedArgsFromInjectedTuple<CurrentInjectTuple>, UserInstanceType extends getInterfaceFromImplementsTuple<CurrentImplementsTuple>>(
                userClass: UserClass<UserConstructorArgs, UserInstanceType, CurrentImplementsTuple, CurrentInjectTuple>
            ) {
                const injectedClass = createInjectedClass(userClass, configuration.scope, containerConfiguration.defaultScope, configuration.inject);
                registerInjectedClass(injectedClass, configuration.implements);
                return injectedClass;
            }
        };
    }
}