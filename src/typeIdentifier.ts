import { MultiTypeIdentifier, LazyTypeIdentifier, ScopedTypeIdentifier, LazyMultiTypeIdentifier, TypeIdentifier } from "./typeContainer.types";
import { ImplementationScope } from "./implementationsContainer.types";

export function createTypeIdentifier<T>(id: string, isLazy: boolean, isMulti: boolean, scope: ImplementationScope): TypeIdentifier<T> {
    return {
        id,
        isLazy,
        isMulti,
        scope,
        get multi(): MultiTypeIdentifier<T> {
            return createMultiTypeIdentifier(id);
        },
        get lazy(): LazyTypeIdentifier<T> {
            return createLazyTypeIdentifier(id);
        },
        get singleton(): ScopedTypeIdentifier<T, 'singleton'> {
            return createScopedTypeIdentifier(id, 'singleton');
        },
        get transient(): ScopedTypeIdentifier<T, 'transient'> {
            return createScopedTypeIdentifier(id, 'transient');
        }
    }
}

function createMultiTypeIdentifier<T>(id: string): MultiTypeIdentifier<T> {
    return {
        id,
        isLazy: false,
        isMulti: true,
        get lazy(): LazyMultiTypeIdentifier<T> {
            return createLazyMultiTypeIdentifier(id);
        }
    }
}

function createLazyTypeIdentifier<T>(id: string): LazyTypeIdentifier<T> {
    return {
        id,
        isLazy: true,
        isMulti: false,
        get multi(): LazyMultiTypeIdentifier<T> {
            return createLazyMultiTypeIdentifier(id);
        }
    }
}

function createLazyMultiTypeIdentifier<T>(id: string): LazyMultiTypeIdentifier<T> {
    return {
        id,
        isLazy: true,
        isMulti: true,
    }
}

function createScopedTypeIdentifier<T, Scope extends ImplementationScope>(id: string, scope: Scope): ScopedTypeIdentifier<T, Scope> {
    return {
        id,
        scope
    }
}