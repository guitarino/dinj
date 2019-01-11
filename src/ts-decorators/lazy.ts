import { addDependencyProp } from "./utils";

export function createLazyDecorator() {
    //return function lazy(): PropertyDecorator {
        return function(prototype: Object, propertyKey: string | symbol) {
            addDependencyProp(prototype, propertyKey, 'isLazy', true);
        }
    //}
}