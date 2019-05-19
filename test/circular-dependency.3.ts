import { type, configureDependency, container } from "./shared/container";
import expect from "expect.js";
import { detectCircularDependency } from "../build/circular";

const IA = type<IA>();
interface IA {
    getB(): IB;
}

const IB = type<IB>();
interface IB {
    getA(): IA;
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
    private a: IA;

    constructor(a: IA) {
        this.a = a;
    }

    getA(): IA {
        return this.a;
    }
}

configureDependency()
    .implements(IB)
    .inject(IA)
    .create(B);

describe(`Circular dependency A -> B -> A`, () => {
    const circular = detectCircularDependency(container);

    it(`detects a circular dependency`, () => {
        expect(circular.isCircular).to.be(true);

        expect(circular.isLazyCircular).to.be(false);
        expect(circular.isSingletonCircular).to.be(false);
        expect(circular.lazyCircularPathways).to.eql([]);
        expect(circular.singletonCircularPathways).to.eql([]);
    });

    it(`path is A -> B -> A`, () => {
        expect(circular.circularPathways).to.eql([
            [A, B, A]
        ]);
    });
});