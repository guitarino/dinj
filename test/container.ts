import { createDecorators } from '../src/babel-legacy-decorators';
import { Container, TContainer } from "../src";

export const container: TContainer = new Container();
export const { type, hasCircularDependencies } = container;
export const {
    dependency,
    inject,
    lazy,
    multi,
    singleton,
    transient
} = createDecorators(container);