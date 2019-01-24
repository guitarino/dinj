import { type, dependency, inject, get } from "./container";
import expect from "expect.js";

const IA = type<IA>();
interface IA {
    aMethod();
}

const IB = type<IB>(IA);
interface IB extends IA {
    bMethod();
}

const IC = type<IC>();
interface IC {
    getA(): IA;
}

@dependency(IB)
class B implements IB {
    aMethod() { }
    bMethod() { }
}

@dependency(IC)
@inject(IA)
class C implements IC {
    private readonly a: IA;

    constructor(a: IA) {
        this.a = a;
    }

    getA(): IA {
        return this.a;
    }
}

describe(`Type hierarchy dependency`, () => {
    describe(`B extends A, register B, C -> A`, () => {
        const c = get(IC);
        const a = c.getA();

        it(`"A" is of correct type`, () => {
            expect(a instanceof B).to.be(true);
        });

        it(`"A" implements "IA" interface`, () => {
            expect(typeof a.aMethod).to.be('function');
        });
    });
});