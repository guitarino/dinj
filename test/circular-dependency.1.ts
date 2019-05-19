import { type, configureDependency, container } from "./shared/container";
import expect from "expect.js";
import { detectCircularDependency } from "../build/circular";

const IA = type<IA>();
interface IA {
}

const IB = type<IB>();
interface IB {
}

class B implements IB {
}

configureDependency()
    .implements(IB)
    .create(B);

class A implements IA {
    private b: IB;

    constructor(b: IB) {
        this.b = b;
    }
}

configureDependency()
    .implements(IA)
    .inject(IB)
    .create(A);

describe(`Circular dependency A -> A`, () => {
    const circular = detectCircularDependency(container);

    it(`detects no circular dependency`, () => {
        expect(circular.isCircular).to.be(false);
        expect(circular.isLazyCircular).to.be(false);
        expect(circular.isSingletonCircular).to.be(false);
        expect(circular.circularPathways).to.eql([]);
        expect(circular.lazyCircularPathways).to.eql([]);
        expect(circular.singletonCircularPathways).to.eql([]);
    });
});