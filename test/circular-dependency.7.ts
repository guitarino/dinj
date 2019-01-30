import { type, dependency, inject, hasCircularDependencies, container } from "./shared/container";
import expect from "expect.js";
import { fake } from "sinon";
import { containsDependencyTree } from "./shared/circular";
import { Lazy } from "../src";

container.configure({
    showLazyPotentialCircularWarning: true,
});

const consoleWarn = fake();
global.console.warn = consoleWarn;

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
@inject(IB.lazy)
class D implements ID {
    private b: Lazy<IB>;

    constructor(b: Lazy<IB>) {
        this.b = b;
    }

    getB(): IB {
        return this.b.value;
    }
}

describe(`Circular dependency A -> B -> C -> D -> Lazy<B>`, () => {
    const isCircular = hasCircularDependencies();
    const warnMessage = consoleWarn.args[0][0];

    it(`detects a potential circular dependency`, () => {
        expect(isCircular).to.be(false);
        expect(warnMessage.indexOf('Potential circular dependency detected') >= 0).to.be(true);
    });

    it(`prints a warning message with path B -> C -> D -> B`, () => {
        expect(containsDependencyTree(warnMessage, ['B', 'C', 'D', 'B'])).to.be(true);
    });
});