
export type Implementation<ConstructorArgsType, InstanceType> = {
    new(...args: ConstructorArgsType[]): InstanceType;
};

export type AnyImplementation = Implementation<any, any>;

export type ImplementationById = {
    [id: string]: AnyImplementation[];
};

export type TImplementationScopes = {
    [id: string]: ImplementationScope;
}

export type ImplementationScope = 'singleton' | 'transient';