import { InjectImplementationArg } from "../decorators.types";
import { DependencyDescriptor } from "../dependenciesContainer.types";

export const DEP_NAME = '_typeinjectDependencies';

export function createInjectDecorator() {
    return function inject<InjectArgs extends any[]>(...dependencyTypes: InjectArgs) {
        return function<T>(userImplementation: InjectImplementationArg<T, InjectArgs>): void {
            const userDependencies: DependencyDescriptor[] = [];
            for (let i = 0; i < dependencyTypes.length; i++) {
                const type = dependencyTypes[i];
                userDependencies.push({
                    id: type.id,
                    isLazy: type.isLazy,
                    isMulti: type.isMulti
                });
            }
            userImplementation[DEP_NAME] = userDependencies;
        }
    }
}