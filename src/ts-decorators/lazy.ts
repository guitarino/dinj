import { addDependencyProp } from "./utils";

export function createLazyDecorator(): PropertyDecorator {
    return function(prototype: Object, propertyKey: string | symbol) {
        addDependencyProp(prototype, propertyKey, 'isLazy', true);
    }
}