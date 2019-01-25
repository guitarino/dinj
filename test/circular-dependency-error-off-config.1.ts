import { type, dependency, inject, hasCircularDependencies, configure } from "./shared/container";
import expect from "expect.js";
import { fake } from "sinon";

configure({
    showCircularDependencyError: false
});

const consoleError = fake();
console.error = consoleError;

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

describe(`Circular dependency (A -> A) with suppressed warning`, () => {
    const isCircular = hasCircularDependencies();

    it(`detects a circular dependency`, () => {
        expect(isCircular).to.be(true);
    });

    it(`the error message is suppressed`, () => {
        expect(consoleError.callCount).to.be(0);
    });
});