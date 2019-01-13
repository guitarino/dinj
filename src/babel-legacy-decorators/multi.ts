import { addDependencyProp } from "./utils";
import { TMultiDecorator } from "../types";

export function createMultiDecorator(): TMultiDecorator {
    return function(prototype: Object, propertyKey: string | symbol) {
        addDependencyProp(prototype, propertyKey, 'isMulti', true);
    }
}