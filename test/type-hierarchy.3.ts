import { type, configureDependency, get } from "./shared/container";
import expect from "expect.js";

const IA = type<IA>();
interface IA {
    aMethod();
}

const IE = type<IE>(IA);
interface IE extends IA {
    eMethod();
}

const ID = type<ID>(IE);
interface ID extends IE {
    dMethod();
}

const IB = type<IB>(ID);
interface IB extends ID {
    bMethod();
}

const IC = type<IC>();
interface IC {
    getA(): IA;
}

class B implements IB {
    aMethod() { }
    bMethod() { }
    dMethod() { }
    eMethod() { }
}

configureDependency()
    .implements(IB)
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
    .create(C);

describe(`Type hierarchy dependency`, () => {
    describe(`B extends D, D extends E, E extends A, register B, C -> A`, () => {
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