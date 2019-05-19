import { type, configureDependency, container } from "./shared/container";
import expect from "expect.js";
import { detectCircularDependency } from "../build/circular";
import { Lazy } from "../build/lazy.types";

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

class A implements IA {
    private b: IB;

    constructor(b: IB) {
        this.b = b;
    }

    getB(): IB {
        return this.b;
    }
}

configureDependency()
    .implements(IA)
    .inject(IB)
    .create(A);

class B implements IB {
    private c: IC;

    constructor(c: IC) {
        this.c = c;
    }

    getC(): IC {
        return this.c;
    }
}

configureDependency()
    .implements(IB)
    .inject(IC)
    .create(B);

class C implements IC {
    private d: ID;

    constructor(d: ID) {
        this.d = d;
    }

    getD(): ID {
        return this.d;
    }
}

configureDependency()
    .implements(IC)
    .inject(ID)
    .create(C);

class D implements ID {
    private b: Lazy<IB>;

    constructor(b: Lazy<IB>) {
        this.b = b;
    }

    getB(): IB {
        return this.b.value;
    }
}

configureDependency()
    .implements(ID)
    .inject(IB.lazy)
    .create(D);

describe(`Circular dependency A -> B -> C -> D -> Lazy<B>`, () => {
    const circular = detectCircularDependency(container);

    it(`detects a potential circular dependency`, () => {
        expect(circular.isCircular).to.be(false);

        expect(circular.isLazyCircular).to.be(true);

        expect(circular.isSingletonCircular).to.be(false);
        expect(circular.circularPathways).to.eql([]);
        expect(circular.singletonCircularPathways).to.eql([]);
    });

    it(`path is B -> C -> D -> B`, () => {
        expect(circular.lazyCircularPathways).to.eql([
            [B, C, D, B]
        ]);
    });
});