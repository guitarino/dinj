
export type TImplementation<TConstructorArgs, TInstanceType> = {
    new(...args: TConstructorArgs[]): TInstanceType;
};

export type TAnyImplementation = TImplementation<any, any>;

export type TImplementationMap = {
    [id: string]: TAnyImplementation[];
};

export type TImplementationScopes = {
    [id: string]: TImplementationScope;
}

export type TImplementationScope = 'singleton' | 'transient';