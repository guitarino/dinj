import { TypeIdentifier, LazyTypeIdentifier, MultiTypeIdentifier, LazyMultiTypeIdentifier, ScopedTypeIdentifier } from "./typeContainer.types";
import { Lazy } from "./lazy.types";
import { ImplementationScope } from "./implementationsContainer.types";

export type TDependencyDecorator = <T>(type: TypeIdentifier<T>) => ClassDecorator;

export type TInjectDecorator = <T>(...dependencyTypes: TypeIdentifier<T>[]) => ClassDecorator;

export type getInjection<InjectArg> =
    InjectArg extends TypeIdentifier<infer U> ? U :
    InjectArg extends LazyTypeIdentifier<infer U> ? Lazy<U> :
    InjectArg extends MultiTypeIdentifier<infer U> ? U[] :
    InjectArg extends LazyMultiTypeIdentifier<infer U> ? Lazy<U[]> :
    never;

export type mapInjectArgsToInjections<InjectArgs extends any[]> = {
    [i in keyof InjectArgs]: getInjection<InjectArgs[i]>;
};

export type getObjectFromTuple<T> = {
    [i in Exclude<keyof T, keyof []>]: T[i]
}

export interface ImplementationWithArgs<T extends any[]> {
    new(...args: T): any
}

export type getInjections<
    InjectArgs extends any[]
> = getObjectFromTuple<
    mapInjectArgsToInjections<
        InjectArgs
    >
>;

export type InjectImplementationArg<UserImplementation, InjectArgs extends any[]> =
    UserImplementation extends ImplementationWithArgs<infer UserImplementationArgs> ?
    UserImplementationArgs extends getInjections<InjectArgs> ? UserImplementation:
    never: never;

export type DependencyDecoratorIdentifierArg<T> =
    TypeIdentifier<T> |
    ScopedTypeIdentifier<T, ImplementationScope>;