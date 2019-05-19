import { ImplementedTypes, InjectedTypes, getInjectedArgsFromInjectedTuple, getInterfaceFromImplementsTuple, UserClass, InjectedClass, Scope } from "./injection.types";

export type CreateConfigureDependencyReturn =
    <
        CurrentScope extends Scope | undefined = undefined,
        CurrentImplementsTuple extends ImplementedTypes = [],
        CurrentInjectTuple extends InjectedTypes = []
    >(configuration: {
        implements: CurrentImplementsTuple | [],
        inject: CurrentInjectTuple | [],
        scope: CurrentScope | undefined
    }) => ConfigureDependencyReturn<CurrentScope, CurrentImplementsTuple, CurrentInjectTuple>;

export type ConfigureDependencyReturn<
    CurrentScope extends Scope | undefined = undefined,
    CurrentImplementsTuple extends ImplementedTypes = [],
    CurrentInjectTuple extends InjectedTypes = []
> = {
    implements: <ImplementsTuple extends Array<any>>(...implementedTypes: ImplementsTuple) =>
        ConfigureDependencyReturn<CurrentScope, ImplementsTuple, CurrentInjectTuple>;

    inject: <InjectTuple extends Array<any>>(...injectedTypes: InjectTuple) =>
        ConfigureDependencyReturn<CurrentScope, CurrentImplementsTuple, InjectTuple>;

    scope: <NewScope extends Scope>(scope: NewScope) =>
        ConfigureDependencyReturn<NewScope, CurrentImplementsTuple, CurrentInjectTuple>;

    create: <
        UserConstructorArgs extends getInjectedArgsFromInjectedTuple<CurrentInjectTuple>,
        UserInstanceType extends getInterfaceFromImplementsTuple<CurrentImplementsTuple>
    >(
        userClass: UserClass<UserConstructorArgs, UserInstanceType, CurrentImplementsTuple, CurrentInjectTuple>
    ) =>
        InjectedClass<UserConstructorArgs, CurrentInjectTuple, UserInstanceType>;
}; 