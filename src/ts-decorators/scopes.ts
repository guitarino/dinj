import { TImplementationScope } from "../container";

export const SCOPE_NAME = '_dinjScope';

export function createSingletonDecorator() {
    //return function singleton(): ClassDecorator {
        return function (Class: any): any {
            const scope: TImplementationScope = 'singleton';
            Class[SCOPE_NAME] = scope;
        }
    //}
}

export function createTransientDecorator() {
    //return function transient(): ClassDecorator {
        return function (Class: any): any {
            const scope: TImplementationScope = 'transient';
            Class[SCOPE_NAME] = scope;
        }
    //}
}