export type UnionToIntersection<Union> = (
    Union extends any
        ? (argument: Union) => void
        : never
) extends (argument: infer Intersection) => void
    ? Intersection
    : never;