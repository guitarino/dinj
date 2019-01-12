import { createDependencyDecorator } from "./dependency";
import { createInjectDecorator } from "./inject";
import { createLazyDecorator } from "./lazy";
import { createMultiDecorator } from "./multi";
import { createSingletonDecorator, createTransientDecorator } from "./scopes";
import { TContainerInternal } from "../types";

export function createDecorators(container: TContainerInternal) {
    return {
        dependency: createDependencyDecorator(container),
        inject: createInjectDecorator(),
        lazy: createLazyDecorator(),
        multi: createMultiDecorator(),
        singleton: createSingletonDecorator(),
        transient: createTransientDecorator()
    }
}