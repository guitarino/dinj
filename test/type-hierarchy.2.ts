import { type, configureDependency, get } from "./shared/container";
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

class B implements IB {
    aMethod() { }
    bMethod() { }
}

configureDependency()
    .implements(IB)
    .scope('singleton')
    .create(B);

class C implements IC {
    private readonly a: IA;

    constructor(a: IA) {
        this.a = a;
    }

    getA(): IA {
        return this.a;
    }
}

configureDependency()
    .implements(IC)
    .inject(IA)
    .scope('transient')
    .create(C);

describe(`Type hierarchy singleton dependency`, () => {
    describe(`B extends A, register B.singleton, 2x(C -> A)`, () => {
        const c1 = get(IC);
        const c2 = get(IC);
        const a1 = c1.getA();
        const a2 = c2.getA();

        it(`"C" instance is not the same`, () => {
            expect(c1 === c2).to.be(false);
        });

        it(`"A" instance is the same`, () => {
            expect(a1 === a2).to.be(true);
        });
    });
});