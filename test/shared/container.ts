import { createDecorators } from '../../build/babel-legacy-decorators';
import { createContainer, Container } from "../../build";

export const container: Container = createContainer();
export const {
    get,
    type,
    hasCircularDependencies,
    getImplementation,
    getImplementations,
    configure
} = container;
export const { dependency, inject } = createDecorators(container);