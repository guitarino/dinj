import { fake } from "sinon";
import expect from "expect.js";
import { type, configureDependency, get } from "./shared/container";

const IA = type<IA>();
interface IA {
}

const IB = type<IB>();
interface IB {
    getAfromB(): IA;
}

const IC = type<IC>();
interface IC {
    getAfromC(): IA;
}

class B implements IB {
    private readonly a: IA;

    constructor(a: IA) {
        this.a = a;
    }

    getAfromB() {
        return this.a;
    }
}

configureDependency()
    .implements(IB)
    .inject(IA)
    .create(B);

class C implements IC {
    private readonly a: IA;

    constructor(a: IA) {
        this.a = a;
    }

    getAfromC() {
        return this.a;
    }
}

configureDependency()
    .implements(IC)
    .inject(IA)
    .create(C);

const aConstructorFake = fake();

class A implements IA {
    constructor() {
        aConstructorFake();
    }
}

configureDependency()
    .implements(IA)
    .scope('singleton')
    .create(A);

describe(`Sinleton dependency registration`, () => {
    describe(`B -> A.singleton, C -> A.singleton`, () => {
        const b = get(IB);
        const c = get(IC);
        const aFromB = b.getAfromB();
        const aFromC = c.getAfromC();
        
        it(`"A" is of correct class`, () => {
            expect(aFromB instanceof A).to.be(true);
            expect(aFromC instanceof A).to.be(true);
        });
        
        it(`"A" is only created once`, () => {
            expect(aConstructorFake.callCount).to.be(1);
        });
        
        it(`The instance to "A" is the same from "B" and "C"`, () => {
            expect(aFromB === aFromC).to.be(true);
        });
    });
});