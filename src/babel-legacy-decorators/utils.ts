import { TDependencyUserDescriptor } from "../types";

export const DEP_NAME = '_ioconDependencies';

export function addDependencyProp<T extends keyof TDependencyUserDescriptor>(
    prototype: any,
    name: string | symbol,
    prop: T,
    value: TDependencyUserDescriptor[T]
) {
    if (!prototype[DEP_NAME]) {
        prototype[DEP_NAME] = [];
    }
    let dependency;
    for (let i = 0; i < prototype[DEP_NAME].length; i++) {
        const existingDependency = prototype[DEP_NAME][i];
        if (existingDependency.name === name) {
            dependency = existingDependency;
        }
    }
    if (!dependency) {
        dependency = { name };
        prototype[DEP_NAME].push(dependency);
    }
    dependency[prop] = value;
}