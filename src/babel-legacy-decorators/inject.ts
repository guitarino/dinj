import { TDependencyDescriptor, TInjectDecoratorKlassArg } from "../types";

export const DEP_NAME = '_typeinjectDependencies';

export function createInjectDecorator() {
    return function inject<TInjectDecoratorArgs extends any[]>(...dependencyTypes: TInjectDecoratorArgs) {
        return function<T>(klass: TInjectDecoratorKlassArg<T, TInjectDecoratorArgs>): void {
            const userDependencies: TDependencyDescriptor[] = [];
            for (let i = 0; i < dependencyTypes.length; i++) {
                const type = dependencyTypes[i];
                userDependencies.push({
                    id: type.id,
                    isLazy: type.isLazy,
                    isMulti: type.isMulti
                });
            }
            klass[DEP_NAME] = userDependencies;
        }
    }
}