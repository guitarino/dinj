import { Container, createImplementation } from "../container";
import { DEP_NAME } from "./utils";
import { SCOPE_NAME } from "./scopes";

export function createDependencyDecorator(container: Container) {
    return function dependency(id: string): ClassDecorator {
        return function (Class: any): any {
            const { prototype } = Class;
            console.log(id, prototype[DEP_NAME], Class[SCOPE_NAME]);
            return createImplementation(container, id, prototype[DEP_NAME] || [], Class, Class[SCOPE_NAME]);
        }
    }
}