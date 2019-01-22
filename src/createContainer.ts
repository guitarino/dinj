import { Container } from "./container";
import { TContainer, TConfiguration, TContainerInternal } from "./types";

export function createContainer(setup?: TConfiguration): TContainer {
    const container: TContainerInternal = new Container();
    if (setup) {
        container.configure(setup);
    }
    return container;
}