export type Scope = 'singleton' | 'transient';

export type ContainerConfiguration = {
    defaultScope: Scope
}