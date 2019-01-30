import { createDecorators } from '../../build/babel-legacy-decorators';
import { createContainer, TContainer } from "../../build";

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