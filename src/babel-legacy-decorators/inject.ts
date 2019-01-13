import { addDependencyProp } from "./utils";
import { TInjectDecorator } from "../types";

export function createInjectDecorator(): TInjectDecorator {
    return function inject(id: string): PropertyDecorator {
        return function(prototype: any, propertyKey: string | symbol, descriptor?: any) {
            addDependencyProp(prototype, propertyKey, 'id', id);

            // For babel, with class properties, the property gets defined twice, which results in a thrown error
            // unless we don't have `initializer` property.
            if (descriptor && typeof descriptor === 'object' && descriptor !== null && 'initializer' in descriptor) {
                delete descriptor.initializer;
            }
        }
    }
}