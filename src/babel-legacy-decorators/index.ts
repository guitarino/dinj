import { createDependencyDecorator } from "./dependency";
import { createInjectDecorator } from "./inject";
import { TContainerInternal, TContainer } from "../types";

export function createDecorators(container: TContainer) {
    return {
        dependency: createDependencyDecorator(container as TContainerInternal),
        inject: createInjectDecorator(),
    }
}