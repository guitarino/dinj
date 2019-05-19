import { type, configureDependency, container } from "./shared/container";
import expect from "expect.js";
import { detectCircularDependency } from "../build/circular";

const IA = type<IA>();
interface IA {
    getA(): IA;
}

class A implements IA {
    private a: IA;

    constructor(a: IA) {
        this.a = a;
    }

    getA(): IA {
        return this.a;
    }
}

configureDependency()
    .implements(IA)
    .inject(IA)
    .create(A);

describe(`Circular dependency A -> A`, () => {
    const circular = detectCircularDependency(container);

    it(`detects a circular dependency`, () => {
        expect(circular.isCircular).to.be(true);
        
        expect(circular.isLazyCircular).to.be(false);
        expect(circular.isSingletonCircular).to.be(false);
        expect(circular.lazyCircularPathways).to.eql([]);
        expect(circular.singletonCircularPathways).to.eql([]);
    });

    it(`path is A -> A`, () => {
        expect(circular.circularPathways).to.eql([
            [A, A]
        ]);
    });
});