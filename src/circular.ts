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
            : mergePaths(oldResult.circularPathways, newResult.circularPathways),
        lazyCircularPathways: !newResult.lazyCircularPathways.length
            ? oldResult.lazyCircularPathways
            : mergePaths(oldResult.lazyCircularPathways, newResult.lazyCircularPathways),
        singletonCircularPathways: !newResult.singletonCircularPathways.length
            ? oldResult.singletonCircularPathways
            : mergePaths(oldResult.singletonCircularPathways, newResult.singletonCircularPathways)
    }
}

function mergePaths(oldPaths: Array<Array<NewableUserClass>>, newPaths: Array<Array<NewableUserClass>>): Array<Array<NewableUserClass>> {
    const paths = [...oldPaths];
    for (let i = 0; i < newPaths.length; i++) {
        const newPath = newPaths[i];
        let equalPathAlreadyExists = false;
        for (let j = 0; j < oldPaths.length; j++) {
            if (arePathsOverlapping(oldPaths[j], newPath)) {
                equalPathAlreadyExists = true;
            }
        }
        if (!equalPathAlreadyExists) {
            paths.push(newPath);
        }
    }
    return paths;
}

function determineLongerAndShorterPaths(pathOne: Array<NewableUserClass>, pathTwo: Array<NewableUserClass>) {
    let longerPath: Array<NewableUserClass>;
    let shorterPath: Array<NewableUserClass>;
    if (pathOne.length > pathTwo.length) {
        longerPath = pathOne;
        shorterPath = pathTwo;
    } else {
        longerPath = pathTwo;
        shorterPath = pathOne;
    }
    return {
        longerPath,
        shorterPath
    }
}

function arePathsOverlapping(pathOne: Array<NewableUserClass>, pathTwo: Array<NewableUserClass>): boolean {
    const { longerPath, shorterPath } = determineLongerAndShorterPaths(pathOne, pathTwo);
    for (let offset = 0; offset < longerPath.length; offset++) {
        if (doesArrOneContainArrTwo(longerPath, shorterPath, offset)) {
            return true;
        }
    }
    return false;
}

function doesArrOneContainArrTwo(arrOne: Array<any>, arrTwo: Array<any>, offset: number): boolean {
    const lastIndex = arrOne.length - 1;
    for (let i = 0; i < arrTwo.length; i++) {
        const desiredIndex = i + offset;
        const index = desiredIndex > lastIndex ? desiredIndex - lastIndex : desiredIndex;
        if (arrOne[index] !== arrTwo[i]) {
            return false;
        }
    }
    return true;
}

function visitNodeAndDetectCircular(
    node: Node,
    currentPath: Array<Node>,
    currentPathResult: CircularDetectionResult
): CircularDetectionResult {
    const circularScenario = handleCircularScenario(node, currentPath, currentPathResult);
    if (circularScenario) {
        return circularScenario;
    }
    return handleNonCircularScenario(node, currentPath, currentPathResult);
}

function handleCircularScenario(
    node: Node,
    currentPath: Array<Node>,
    currentPathResult: CircularDetectionResult
): CircularDetectionResult | undefined {
    const nodeIndex = getNodeIndex(node, currentPath);
    if (nodeIndex >= 0) {
        const path = currentPath.slice(nodeIndex);
        const isLazyCircular = doesPathContainLazy(node, path.slice(1));
        const isSingletonCircular = doesPathContainSingleton(node, path);
        const isCircular = !isLazyCircular && !isSingletonCircular;
        const newPaths = [ createUserPath(node, path) ];
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
    currentPath: Array<Node>,
    currentPathResult: CircularDetectionResult
): CircularDetectionResult {
    return visitTypesAndDetectCircular(
        node.implementation.injectedTypes,
        [...currentPath, node],
        currentPathResult
    );
}

function createUserPath(node: Node, currentPath: Array<Node>): Array<NewableUserClass> {
    const path = [...currentPath, node];
    const userPath: Array<NewableUserClass> = [];
    for (let i = 0; i < path.length; i++) {
        const node = path[i];
        userPath.push(node.implementation.userClass);
    }
    return userPath;
}

function getNodeIndex(node: Node, path: Array<Node>): number {
    for (let i = 0; i < path.length; i++) {
        if (node.implementation === path[i].implementation) {
            return i;
        }
    }
    return -1;
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