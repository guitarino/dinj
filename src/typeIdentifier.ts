import { TMultiTypeIdentifier, TLazyTypeIdentifier, TScopedTypeIdentifier, TLazyMultiTypeIdentifier, TTypeIdentifier } from "./typeContainer.types";
import { TImplementationScope } from "./implementationsContainer.types";

export function createTypeIdentifier<T>(id: string, isLazy: boolean, isMulti: boolean, scope: TImplementationScope): TTypeIdentifier<T> {
    return {
        id,
        isLazy,
        isMulti,
        scope,
        get multi(): TMultiTypeIdentifier<T> {
            return createMultiTypeIdentifier(id);
        },
        get lazy(): TLazyTypeIdentifier<T> {
            return createLazyTypeIdentifier(id);
        },
        get singleton(): TScopedTypeIdentifier<T, 'singleton'> {
            return createScopedTypeIdentifier(id, 'singleton');
        },
        get transient(): TScopedTypeIdentifier<T, 'transient'> {
            return createScopedTypeIdentifier(id, 'transient');
        }
    }
}

function createMultiTypeIdentifier<T>(id: string): TMultiTypeIdentifier<T> {
    return {
        id,
        isLazy: false,
        isMulti: true,
        get lazy(): TLazyMultiTypeIdentifier<T> {
            return createLazyMultiTypeIdentifier(id);
        }
    }
}

function createLazyTypeIdentifier<T>(id: string): TLazyTypeIdentifier<T> {
    return {
        id,
        isLazy: true,
        isMulti: false,
        get multi(): TLazyMultiTypeIdentifier<T> {
            return createLazyMultiTypeIdentifier(id);
        }
    }
}

function createLazyMultiTypeIdentifier<T>(id: string): TLazyMultiTypeIdentifier<T> {
    return {
        id,
        isLazy: true,
        isMulti: true,
    }
}

function createScopedTypeIdentifier<T, Scope extends TImplementationScope>(id: string, scope: Scope): TScopedTypeIdentifier<T, Scope> {
    return {
        id,
        scope
    }
}