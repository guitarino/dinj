import { NewableUserClass } from "./injection.types";

export type CircularDetectionResult = {
    isCircular: boolean,
    isLazyCircular: boolean,
    isSingletonCircular: boolean,
    circularPathways: Array<Array<NewableUserClass>>,
    lazyCircularPathways: Array<Array<NewableUserClass>>,
    singletonCircularPathways: Array<Array<NewableUserClass>>
}