import { type, configureDependency, get } from "./shared/container";
import expect from "expect.js";

const IA = type<IA>();
interface IA {
    aMethod();
}

const IB = type<IB>();
interface IB {
    bMethod();
}

const IC = type<IC>();
interface IC {
    cMethod();
}

class D implements IA, IB, IC {
    aMethod() { }
    bMethod() { }
    cMethod() { }
}

configureDependency()
    .implements(IA, IB, IC)
    .create(D);

describe(`Type hierarchy dependency`, () => {
    describe(`D extends A, B and C, register D`, () => {
        const a = get(IA);
        const b = get(IB);
        const c = get(IC);

        it(`"A" is of correct type`, () => {
            expect(a instanceof D).to.be(true);
        });

        it(`"A" implements "IA" interface`, () => {
            expect(typeof a.aMethod).to.be('function');
        });

        it(`"B" is of correct type`, () => {
            expect(b instanceof D).to.be(true);
        });

        it(`"B" implements "IB" interface`, () => {
            expect(typeof b.bMethod).to.be('function');
        });

        it(`"C" is of correct type`, () => {
            expect(c instanceof D).to.be(true);
        });

        it(`"C" implements "IC" interface`, () => {
            expect(typeof c.cMethod).to.be('function');
        });
    });
});