export type TDependencyDescriptor = {
    isLazy: boolean,
    isMulti: boolean,
    id: string
};

export type TDependencies = {
    [id: string]: TDependencyDescriptor[]
};