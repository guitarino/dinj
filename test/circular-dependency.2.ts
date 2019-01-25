import { type, dependency, inject, hasCircularDependencies } from "./shared/container";
import expect from "expect.js";
import { fake } from "sinon";
import { containsDependencyTree } from "./shared/circular";

const consoleError = fake();
console.error = consoleError;

const IA = type<IA>();
interface IA {
    getB(): IB;
}

const IB = type<IB>();
interface IB {
    getA(): IA;
}

@dependency(IA)
@inject(IB)
class A implements IA {
    private b: IB;

    constructor(b: IB) {
        this.b = b;
    }

    getB(): IB {
        return this.b;
    }
}

@dependency(IB)
@inject(IA)
class B implements IB {
    private a: IA;

    constructor(a: IA) {
        this.a = a;
    }

    getA(): IA {
        return this.a;
    }
}

describe(`Circular dependency A -> B -> A`, () => {
    const isCircular = hasCircularDependencies();
    const errorMessage = consoleError.args[0][0];

    it(`detects a circular dependency`, () => {
        expect(isCircular).to.be(true);
        expect(errorMessage.indexOf('Circular dependency detected') >= 0).to.be(true);
    });

    it(`prints an error message with path A -> B -> A`, () => {
        expect(containsDependencyTree(errorMessage, ['A', 'B', 'A'])).to.be(true);
    });
});