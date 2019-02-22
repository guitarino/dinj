import { ImplementationScope } from "./implementationsContainer.types";

export type TypeIdentifierById = {
    [id: string]: string[];
};

export interface AnyTypeIdentifier {
    id: string
}

export interface TypeIdentifier<T> extends AnyTypeIdentifier {
    id: string,
    isLazy: boolean,
    isMulti: boolean,
    scope: ImplementationScope,
    multi: MultiTypeIdentifier<T>,
    lazy: LazyTypeIdentifier<T>,
    singleton: ScopedTypeIdentifier<T, 'singleton'>,
    transient: ScopedTypeIdentifier<T, 'transient'>
}

export interface MultiTypeIdentifier<T> extends AnyTypeIdentifier {
    id: string,
    isLazy: false,
    isMulti: true,
    lazy: LazyMultiTypeIdentifier<T>
}

export interface LazyTypeIdentifier<T> extends AnyTypeIdentifier {
    id: string,
    isLazy: true,
    isMulti: false,
    multi: LazyMultiTypeIdentifier<T>
}

export interface LazyMultiTypeIdentifier<T> extends AnyTypeIdentifier {
    id: string,
    isLazy: true,
    isMulti: true
}

export interface ScopedTypeIdentifier<T, Scope extends ImplementationScope> extends AnyTypeIdentifier {
    id: string,
    scope: Scope
}