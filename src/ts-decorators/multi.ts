import { Container } from "../container";
import { addDependencyProp } from "./utils";

export function createMultiDecorator() {
    //return function multi(): PropertyDecorator {
        return function(prototype: Object, propertyKey: string | symbol) {
            addDependencyProp(prototype, propertyKey, 'isMulti', true);
        }
    //}
}