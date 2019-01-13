import { TImplementationScope } from "../types";

export const SCOPE_NAME = '_ioconScope';

export function createSingletonDecorator(): ClassDecorator {
    return function (Class: any): any {
        const { prototype } = Class;
        const scope: TImplementationScope = 'singleton';
        prototype[SCOPE_NAME] = scope;
    }
}

export function createTransientDecorator(): ClassDecorator {
    return function (Class: any): any {
        const { prototype } = Class;
        const scope: TImplementationScope = 'transient';
        prototype[SCOPE_NAME] = scope;
    }
}