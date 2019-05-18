import { ContainerConfiguration } from "./configuration.types";
import { ImplementationById } from "./implementationsContainer.types";
import { DependenciesById } from "./dependenciesContainer.types";
import { IS_SINGLETON } from "./implementationsContainer.cnst";
import { TYPE_ID } from "./typeContainer.cnst";

export function circularDependencyDetector(
    configuration: ContainerConfiguration,
    implementationsById: ImplementationById,
    dependenciesById: DependenciesById
) {
    function isCurrentDependencyCircular(
        newDependencyAncestors: string[],
        currentDependencyId: string,
        newIsSingleton: boolean[],
        currentIsLazy: boolean[]
    ): boolean {
        for (let j = 0; j < newDependencyAncestors.length; j++) {
            const dependencyAncestorId = newDependencyAncestors[j];
            if (currentDependencyId === dependencyAncestorId) {
                const dependencyPathString = configuration.showLazyPotentialCircularWarning ||
                    configuration.showSingletonPotentialCircularWarning ||
                    configuration.showCircularDependencyError
                    ? [...newDependencyAncestors.slice(j), currentDependencyId].join(' -> ')
                    : '';
                const currentHasLazy = currentIsLazy.slice(j).reduce((prev, next) => prev || next, false);
                const newHasSingleton = newIsSingleton.slice(j).reduce((prev, next) => prev || next, false);
                if (currentHasLazy) {
                    if (configuration.showLazyPotentialCircularWarning) {
                        console.warn(`Potential circular dependency detected (one of the dependencies is lazy): ${dependencyPathString}. To disable this warning, configure 'showLazyPotentialCircularWarning' to be 'false'.`);
                    }
                    break;
                }
                if (newHasSingleton) {
                    if (configuration.showSingletonPotentialCircularWarning) {
                        console.warn(`Potential circular dependency detected (one of the dependencies is a singleton): ${dependencyPathString}. To disable this warning, configure 'showSingletonPotentialCircularWarning' to be 'false'.`);
                    }
                    break;
                }
                if (!currentHasLazy && !newHasSingleton) {
                    if (configuration.showCircularDependencyError) {
                        console.error(`Circular dependency detected: ${dependencyPathString}. To disable this error, configure 'showCircularDependencyError' to be 'false'.`);
                    }
                    return true;
                }
            }
        }
        return false;
    }

    function isDependencyVisitCircular(
        visitedIds: string[],
        dependencyId: string,
        dependencyAncestorIds: string[] = [],
        isSingleton: boolean[] = [],
        isLazy: boolean[] = []
    ): boolean {
        const implementation = implementationsById[dependencyId][0];
        const newDependencyAncestors = [
            ...dependencyAncestorIds,
            dependencyId
        ];
        const newIsSingleton = [
            ...isSingleton,
            !!implementation[IS_SINGLETON]
        ];
        visitedIds.push(dependencyId);
        const dependencies = dependenciesById[dependencyId];
        for (let i = 0; i < dependencies.length; i++) {
            const dependency = dependencies[i];
            const implementations = implementationsById[dependency.id];
            const childDependencyIsLazy = dependency.isLazy;
            for (let j = 0; j < (dependency.isMulti ? implementations.length : 1); j++) {
                const childDependencyId = implementations[j][TYPE_ID];
                const currentIsLazy = [
                    ...isLazy,
                    childDependencyIsLazy
                ];
                if (isCurrentDependencyCircular(newDependencyAncestors, childDependencyId, newIsSingleton, currentIsLazy)) {
                    return true;
                }
                if (~visitedIds.indexOf(childDependencyId)) {
                    continue;
                }
                if (isDependencyVisitCircular(visitedIds, childDependencyId, newDependencyAncestors, newIsSingleton, currentIsLazy)) {
                    return true;
                }
            }
        }
        return false;
    }

    function hasCircularDependencies() {
        const visitedIds: string[] = [];
        for (let dependencyId in dependenciesById) {
            if (isDependencyVisitCircular(visitedIds, dependencyId, [])) {
                return true;
            }
        }
        return false;
    }

    return {
        hasCircularDependencies
    }
}