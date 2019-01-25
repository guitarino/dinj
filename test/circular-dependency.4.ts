import { type, dependency, inject, hasCircularDependencies } from "./shared/container";
import expect from "expect.js";
import { fake } from "sinon";
import { containsDependencyTree } from "./shared/circular";
import { Lazy } from "../src";

const consoleError = fake();
console.error = consoleError;

const IA = type<IA>();
interface IA {
    getB(): IB;
}

const IB = type<IB>();
interface IB {
    getC(): IC;
}

const IC = type<IC>();
interface IC {
    getD(): ID;
}

const ID = type<ID>();
interface ID {
    getB(): IB;
}

@dependency(IA.singleton)
@inject(IB.lazy)
class A implements IA {
    private b: Lazy<IB>;

    constructor(b: Lazy<IB>) {
        this.b = b;
    }

    getB(): IB {
        return this.b.value;
    }
}

@dependency(IB)
@inject(IC)
class B implements IB {
    private c: IC;

    constructor(c: IC) {
        this.c = c;
    }

    getC(): IC {
        return this.c;
    }
}

@dependency(IC)
@inject(ID)
class C implements IC {
    private d: ID;

    constructor(d: ID) {
        this.d = d;
    }

    getD(): ID {
        return this.d;
    }
}

@dependency(ID)
@inject(IB)
class D implements ID {
    private b: IB;

    constructor(b: IB) {
        this.b = b;
    }

    getB(): IB {
        return this.b;
    }
}

describe(`Circular dependency A.singleton -> Lazy<B> -> C -> D -> B`, () => {
    const isCircular = hasCircularDependencies();
    const errorMessage = consoleError.args[0][0];

    it(`detects a circular dependency`, () => {
        expect(isCircular).to.be(true);
        expect(errorMessage.indexOf('Circular dependency detected') >= 0).to.be(true);
    });

    it(`prints an error message with path B -> C -> D -> B`, () => {
        expect(containsDependencyTree(errorMessage, ['B', 'C', 'D', 'B'])).to.be(true);
    });
});