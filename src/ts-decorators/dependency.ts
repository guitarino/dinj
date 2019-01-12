import { DEP_NAME } from "./utils";
import { SCOPE_NAME } from "./scopes";
import { TContainerInternal } from "../types";
import { createImplementation } from "../createImplementation";

export function createDependencyDecorator(container: TContainerInternal) {
    return function dependency(id: string): ClassDecorator {
        return function (Class: any): any {
            const { prototype } = Class;
            return createImplementation(container, id, prototype[DEP_NAME] || [], Class, prototype[SCOPE_NAME]);
        }
    }
}