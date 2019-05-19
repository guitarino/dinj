import { CircularDetectionResult } from "./circular.types";
import { TypeInjected, InjectedClassFromInterface, NewableUserClass } from "./injection.types";
import { Container } from "./container.types";

type Node = {
    isLazy: boolean,
    implementation: InjectedClassFromInterface
}

const defaultCircularDetectionResult = {
    isCircular: false,
    isLazyCircular: false,
    isSingletonCircular: false,
    circularPathways: [],
    lazyCircularPathways: [],
    singletonCircularPathways: []
};

export function detectCircularDependency<UserContainer extends Container>(container: UserContainer): CircularDetectionResult {
    return visitTypesAndDetectCircular(container.types, [], defaultCircularDetectionResult);
}

function visitTypesAndDetectCircular(
    types: Array<TypeInjected>,    
    path: Array<Node>,
    currentPathResult: CircularDetectionResult
): CircularDetectionResult {
    let currentResult: CircularDetectionResult = defaultCircularDetectionResult;
    const nodes = createTypesNodes(types);
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        currentResult = populateDetectionResult(currentResult, visitNodeAndDetectCircular(node, path, currentPathResult));
    }
    return currentResult;
}

function createTypesNodes(types: Array<TypeInjected>): Array<Node> {
    const nodes: Array<Node> = [];
    for (let i = 0; i < types.length; i++) {
        const type = types[i];
        nodes.push(...createNodes(type));
    }
    return nodes;
}

function createNodes(type: TypeInjected): Array<Node> {
    const implementations = type.isMulti ? type.implementations : [type.implementations[0]];
    const nodes: Array<Node> = [];
    for (let i = 0; i < implementations.length; i++) {
        nodes.push({
            isLazy: type.isLazy,
            implementation: implementations[i]
        });
    }
    return nodes;
}

function populateDetectionResult(oldResult: CircularDetectionResult, newResult: CircularDetectionResult): CircularDetectionResult {
    return {
        isCircular: oldResult.isCircular || newResult.isCircular,
        isLazyCircular: oldResult.isLazyCircular || newResult.isLazyCircular,
        isSingletonCircular: oldResult.isSingletonCircular || newResult.isSingletonCircular,
        circularPathways: !newResult.circularPathways.length
            ? oldResult.circularPathways
            : [...oldResult.circularPathways, ...newResult.circularPathways],
        lazyCircularPathways: !newResult.lazyCircularPathways.length
            ? oldResult.lazyCircularPathways
            : [...oldResult.lazyCircularPathways, ...newResult.lazyCircularPathways],
        singletonCircularPathways: !newResult.singletonCircularPathways.length
            ? oldResult.singletonCircularPathways
            : [...oldResult.singletonCircularPathways, ...newResult.singletonCircularPathways]
    }
}

function visitNodeAndDetectCircular(
    node: Node,
    currentPath: Array<Node>,
    currentPathResult: CircularDetectionResult
): CircularDetectionResult {
    const path = [...currentPath, node];
    const circularScenario = handleCircularScenario(node, currentPath, path, currentPathResult);
    if (circularScenario) {
        return circularScenario;
    }
    return handleNonCircularScenario(node, path, currentPathResult);
}

function handleCircularScenario(
    node: Node,
    currentPath: Array<Node>,
    path: Array<Node>,
    currentPathResult: CircularDetectionResult
): CircularDetectionResult | undefined {
    if (isNodeInPath(node, currentPath)) {
        const isLazyCircular = doesPathContainLazy(node, currentPath);
        const isSingletonCircular = doesPathContainSingleton(node, currentPath);
        const isCircular = !isLazyCircular && !isSingletonCircular;
        const newPaths = [ createUserPath(path) ];
        const noNewPaths = [];
        return populateDetectionResult(currentPathResult, {
            isCircular,
            isLazyCircular,
            isSingletonCircular,
            circularPathways: isCircular ? newPaths : noNewPaths,
            lazyCircularPathways: isLazyCircular ? newPaths : noNewPaths,
            singletonCircularPathways: isSingletonCircular  ? newPaths : noNewPaths
        })
    }
}

function handleNonCircularScenario(
    node: Node,
    path: Array<Node>,
    currentPathResult: CircularDetectionResult
): CircularDetectionResult {
    return visitTypesAndDetectCircular(
        node.implementation.injectedTypes,
        path,
        currentPathResult
    );
}

function createUserPath(path: Array<Node>): Array<NewableUserClass> {
    const userPath: Array<NewableUserClass> = [];
    for (let i = 0; i < path.length; i++) {
        const node = path[i];
        userPath.push(node.implementation.userClass);
    }
    return userPath;
}

function isNodeInPath(node: Node, path: Array<Node>) {
    for (let i = 0; i < path.length; i++) {
        if (node.implementation === path[i].implementation) {
            return true;
        }
    }
    return false;
}

function doesPathContainSingleton(node: Node, currentPath: Array<Node>) {
    if (node.implementation.scope === 'singleton') {
        return true;
    }
    for (let i = 0; i < currentPath.length; i++) {
        const node = currentPath[i];
        if (node.implementation.scope === 'singleton') {
            return true;
        }
    }
    return false;
}

function doesPathContainLazy(node: Node, currentPath: Array<Node>) {
    if (node.isLazy) {
        return true;
    }
    for (let i = 0; i < currentPath.length; i++) {
        const node = currentPath[i];
        if (node.isLazy) {
            return true;
        }
    }
    return false;
}