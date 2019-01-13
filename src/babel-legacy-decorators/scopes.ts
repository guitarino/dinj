import { TImplementationScope, TSingletonDecorator, TTransientDecorator } from "../types";

export const SCOPE_NAME = '_ioconScope';

export function createSingletonDecorator(): TSingletonDecorator {
    return function (Class: any): any {
        const { prototype } = Class;
        const scope: TImplementationScope = 'singleton';
        prototype[SCOPE_NAME] = scope;
    }
}

export function createTransientDecorator(): TTransientDecorator {
    return function (Class: any): any {
        const { prototype } = Class;
        const scope: TImplementationScope = 'transient';
        prototype[SCOPE_NAME] = scope;
    }
}