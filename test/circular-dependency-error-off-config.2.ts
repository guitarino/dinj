import { type, dependency, inject, hasCircularDependencies, configure } from "./shared/container";
import expect from "expect.js";
import { fake } from "sinon";

configure({
    showSingletonPotentialCircularWarning: false
});

const consoleWarn = fake();
console.warn = consoleWarn;

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

@dependency(IB.singleton)
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

describe(`Circular dependency (A -> B.singleton -> C -> D -> B) with suppressed warning`, () => {
    const isCircular = hasCircularDependencies();

    it(`detects a potential circular dependency`, () => {
        expect(isCircular).to.be(false);
    });

    it(`the error message is suppressed`, () => {
        expect(consoleWarn.callCount).to.be(0);
    });
});