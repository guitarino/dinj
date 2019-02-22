import { createDependencyDecorator } from "./dependency";
import { createInjectDecorator } from "./inject";
import { Container, ContainerInternal } from "../container.types";

export function createDecorators(container: Container) {
    return {
        dependency: createDependencyDecorator(container as ContainerInternal),
        inject: createInjectDecorator(),
    }
}