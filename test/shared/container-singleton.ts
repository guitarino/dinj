import { createContainer } from "../../build";

export const container = createContainer();

export const { get, configureDependency, type } = container;