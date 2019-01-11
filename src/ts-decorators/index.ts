import { Container } from "../container";
import { createDependencyDecorator } from "./dependency";
import { createInjectDecorator } from "./inject";
import { createLazyDecorator } from "./lazy";
import { createMultiDecorator } from "./multi";
import { createSingletonDecorator, createTransientDecorator } from "./scopes";

export function createDecorators(container: Container) {
    return {
        dependency: createDependencyDecorator(container),
        inject: createInjectDecorator(),
        lazy: createLazyDecorator(),
        multi: createMultiDecorator(),
        singleton: createSingletonDecorator(),
        transient: createTransientDecorator()
    }
}