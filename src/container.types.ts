import { Type } from "./type.types";
import { Scope } from "./injection.types";

export type ContainerConfiguration = {
    defaultScope: Scope
}

export type Container = {
    types: Array<Type<any>>
}