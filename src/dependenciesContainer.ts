import { TDependencies, TDependencyDescriptor } from "./dependenciesContainer.types";
import { createLazy } from "./lazy";
import { TTypeIdentifier } from "./typeContainer.types";
import { TImplementationMap } from "./implementationsContainer.types";
import { IS_SINGLETON, SINGLETON } from "./implementationsContainer.cnst";

function createDependenciesContainer(implementationsById: TImplementationMap) {
    const dependenciesById: TDependencies = {};
    
    function registerDependencies(id: string, userDependencies: TDependencyDescriptor[]) {
        const dependencies: TDependencyDescriptor[] = [];
        for (let i = 0; i < userDependencies.length; i++) {
            const userDependency = userDependencies[i];
            dependencies.push({
                isLazy: userDependency.isLazy,
                isMulti: userDependency.isMulti,
                id: userDependency.id
            });
        }
        dependenciesById[id] = dependencies;
    }
    
    function createDependencyGetter(dependency: TDependencyDescriptor) {
        return () => {
            if (dependency.isMulti) {
                return getMulti(dependency.id);
            }
            else {
                return getSingle(dependency.id, 0, []);
            }
        }
    }

    function getConstructorArgs(id: string): any[] {
        const constructorArgs: any[] = [];
        const dependencies = dependenciesById[id];
        for (let i = 0; i < dependencies.length; i++) {
            const dependency = dependencies[i];
            const getter = createDependencyGetter(dependency);
            if (dependency.isLazy) {
                constructorArgs.push(createLazy(getter));
            }
            else {
                constructorArgs.push(getter());
            }
        }
        return constructorArgs;
    }

    function get<T>(type: TTypeIdentifier<T>, ...args: any[]): T {
        return getSingle(type.id, 0, args);
    }

    function getSingle<T>(id: string, index: number, args: any[]): T {
        const implementation = implementationsById[id][index];
        const instance = implementation[IS_SINGLETON] && implementation[SINGLETON] ?
            implementation[SINGLETON] :
            new implementation();
        if (implementation[IS_SINGLETON] && !implementation[SINGLETON]) {
            implementation[SINGLETON] = instance;
        }
        return instance;
    }

    function getMulti<T>(id: string): T {
        const implementationCount = implementationsById[id].length;
        const instances: any = [];
        for (let i = 0; i < implementationCount; i++) {
            instances.push(getSingle(id, i, []));
        }
        return instances;
    }
}