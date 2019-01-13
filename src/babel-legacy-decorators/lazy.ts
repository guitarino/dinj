import { addDependencyProp } from "./utils";
import { TLazyDecorator } from "../types";

export function createLazyDecorator(): TLazyDecorator {
    return function(prototype: Object, propertyKey: string | symbol) {
        addDependencyProp(prototype, propertyKey, 'isLazy', true);
    }
}