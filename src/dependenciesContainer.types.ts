export type DependencyDescriptor = {
    isLazy: boolean,
    isMulti: boolean,
    id: string
};

export type DependenciesById = {
    [id: string]: DependencyDescriptor[]
};