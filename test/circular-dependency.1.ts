import { type, dependency, inject, hasCircularDependencies } from "./shared/container";
import expect from "expect.js";
import { fake } from "sinon";
import { containsDependencyTree } from "./shared/circular";

const consoleError = fake();
global.console.error = consoleError;

const IA = type<IA>();
interface IA {
    getA(): IA;
}

@dependency(IA)
@inject(IA)
class A implements IA {
    private a: IA;

    constructor(a: IA) {
        this.a = a;
    }

    getA(): IA {
        return this.a;
    }
}

describe(`Circular dependency A -> A`, () => {
    const isCircular = hasCircularDependencies();
    const errorMessage = consoleError.args[0][0];

    it(`detects a circular dependency`, () => {
        expect(isCircular).to.be(true);
        expect(errorMessage.indexOf('Circular dependency detected') >= 0).to.be(true);
    });

    it(`prints an error message with path A -> A`, () => {
        expect(containsDependencyTree(errorMessage, ['A', 'A'])).to.be(true);
    });
});