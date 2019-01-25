import { createDecorators } from '../../src/babel-legacy-decorators';
import { createContainer, TContainer } from "../../src";

export const container: TContainer = createContainer();
export const {
    get,
    type,
    hasCircularDependencies,
    getImplementation,
    getImplementations,
    configure
} = container;
export const { dependency, inject } = createDecorators(container);