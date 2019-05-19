import { fake } from "sinon";
import expect from "expect.js";
import { type, configureDependency, get } from "./shared/container";

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

}

const aConstructorFake = fake();

class A implements IA {
    private readonly b: IB;
    
    constructor(b: IB) {
        this.b = b;
        aConstructorFake();
    }
    
    getB() {
        return this.b;
    }
}

configureDependency()
    .implements(IA)
    .inject(IB)
    .create(A);

const bConstructorFake = fake();

class B implements IB {
    private readonly c: IC;
    
    constructor(c: IC) {
        this.c = c;
        bConstructorFake();
    }
    
    getC() {
        return this.c;
    }
}

configureDependency()
    .implements(IB)
    .inject(IC)
    .create(B);

const cConstructorFake = fake();

class C implements IC {
    private readonly d: ID;
    
    constructor(d: ID) {
        this.d = d;
        cConstructorFake();
    }
    
    getD() {
        return this.d;
    }
}

configureDependency()
    .implements(IC)
    .inject(ID)
    .create(C);

const dConstructorFake = fake();

class D implements ID {
    constructor() {
        dConstructorFake();
    }
}

configureDependency()
    .implements(ID)
    .create(D);

describe(`Deeply nested dependency tree`, () => {
    describe(`A -> B -> C -> D`, () => {
        const a = get(IA);
        let b, c, d;

        it(`"A", "B", "C", "D" were all retrieved once`, () => {
            expect(aConstructorFake.callCount).to.be(1);
            expect(bConstructorFake.callCount).to.be(1);
            expect(cConstructorFake.callCount).to.be(1);
            expect(dConstructorFake.callCount).to.be(1);
        });

        it(`"A" is of correct class`, () => {
            expect(a instanceof A).to.be(true);
        });

        it(`"B" is of correct class`, () => {
            b = a.getB();
            expect(b instanceof B).to.be(true);
        });

        it(`"C" is of correct class`, () => {
            c = b.getC();
            expect(c instanceof C).to.be(true);
        });

        it(`"D" is of correct class`, () => {
            d = c.getD();
            expect(d instanceof D).to.be(true);
        });
    });
});