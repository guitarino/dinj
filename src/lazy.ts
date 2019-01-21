import { Lazy } from "./types";

export function createLazy<TType>(getImplementation): Lazy<TType> {
    let implementation;

    return {
        get value() {
            if (implementation) {
                return implementation;
            }
            return getImplementation();
        }
    }
}