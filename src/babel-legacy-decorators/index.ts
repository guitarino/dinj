import { createDependencyDecorator } from "./dependency";
import { createInjectDecorator } from "./inject";
import { createLazyDecorator } from "./lazy";
import { createMultiDecorator } from "./multi";
import { createSingletonDecorator, createTransientDecorator } from "./scopes";
import { TContainerInternal, TContainer } from "../types";

export function createDecorators(container: TContainer) {
    return {
        dependency: createDependencyDecorator(container as TContainerInternal),
        inject: createInjectDecorator(),
        lazy: createLazyDecorator(),
        multi: createMultiDecorator(),
        singleton: createSingletonDecorator(),
        transient: createTransientDecorator()
    }
}