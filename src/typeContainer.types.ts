import { TImplementationScope } from "./implementationsContainer.types";

export type TypeIdentifierMap = {
    [id: string]: string[];
};

export interface TAnyTypeIdentifier {
    id: string
}

export interface TTypeIdentifier<T> extends TAnyTypeIdentifier {
    id: string,
    isLazy: boolean,
    isMulti: boolean,
    scope: TImplementationScope,
    multi: TMultiTypeIdentifier<T>,
    lazy: TLazyTypeIdentifier<T>,
    singleton: TScopedTypeIdentifier<T, 'singleton'>,
    transient: TScopedTypeIdentifier<T, 'transient'>
}

export interface TMultiTypeIdentifier<T> extends TAnyTypeIdentifier {
    id: string,
    isLazy: false,
    isMulti: true,
    lazy: TLazyMultiTypeIdentifier<T>
}

export interface TLazyTypeIdentifier<T> extends TAnyTypeIdentifier {
    id: string,
    isLazy: true,
    isMulti: false,
    multi: TLazyMultiTypeIdentifier<T>
}

export interface TLazyMultiTypeIdentifier<T> extends TAnyTypeIdentifier {
    id: string,
    isLazy: true,
    isMulti: true
}

export interface TScopedTypeIdentifier<T, Scope extends TImplementationScope> extends TAnyTypeIdentifier {
    id: string,
    scope: Scope
}