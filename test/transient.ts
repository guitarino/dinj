import { fake } from "sinon";
import expect from "expect.js";
import { type, dependency, inject, get } from "./shared/container";

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

@dependency(IB)
@inject(IA)
class B implements IB {
    private readonly a: IA;

    constructor(a: IA) {
        this.a = a;
    }

    getAfromB() {
        return this.a;
    }
}

@dependency(IC)
@inject(IA)
class C implements IC {
    private readonly a: IA;

    constructor(a: IA) {
        this.a = a;
    }

    getAfromC() {
        return this.a;
    }
}

const aConstructorFake = fake();

@dependency(IA.transient)
class A implements IA {
    constructor() {
        aConstructorFake();
    }
}

describe(`Transient dependency registration`, () => {
    describe(`B -> A, C -> A`, () => {
        const b = get(IB);
        const c = get(IC);
        const aFromB = b.getAfromB();
        const aFromC = c.getAfromC();
        
        it(`"A" is of correct class`, () => {
            expect(aFromB instanceof A).to.be(true);
            expect(aFromC instanceof A).to.be(true);
        });
        
        it(`"A" was created twice`, () => {
            expect(aConstructorFake.callCount).to.be(2);
        });
        
        it(`The instance to "A" is not the same from "B" and "C"`, () => {
            expect(aFromB === aFromC).to.be(false);
        });
    });
});