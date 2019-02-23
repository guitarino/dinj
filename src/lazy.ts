import { Lazy } from "./lazy.types";

export function createLazy<T>(getImplementation): Lazy<T> {
    let implementation;

    return {
        get value() {
            if (implementation) {
                return implementation;
            }
            implementation = getImplementation();
            return implementation;
        }
    }
}