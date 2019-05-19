import { Type } from "./type.types";
import { Scope } from "./injection.types";
import { CreateConfigureDependencyReturn } from "./configuration.types";

export type ContainerConfiguration = {
    defaultScope: Scope
}

export type Container = {
    types: Array<Type<any>>,
    configureDependency: CreateConfigureDependencyReturn,
    get<Interface>(type: Type<Interface>, ...args: Array<any>): Interface,
    type<Interface>(...childTypes: Array<Type<Partial<Interface>>>): Type<Interface>
}