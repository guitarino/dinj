import { addDependencyProp } from "./utils";

export function createInjectDecorator() {
    return function inject(id: string): PropertyDecorator {
        return function(prototype: any, propertyKey: string | symbol) {
            addDependencyProp(prototype, propertyKey, 'id', id);
        }
    }
}