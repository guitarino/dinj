import { createContainer } from "../../build";

export const container = createContainer({
    defaultScope: 'transient'
});

export const { get, configureDependency, type } = container;