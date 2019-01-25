import { fake } from "sinon";
import expect from "expect.js";
import { type, dependency, inject, get, configure } from "./shared/container";

configure({
    defaultScope: 'singleton'
});

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

@dependency(IB.transient)
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

@dependency(IC.transient)
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

@dependency(IA)
class A implements IA {
    constructor() {
        aConstructorFake();
    }
}

describe(`Sinleton by default dependency registration`, () => {
    describe(`B.transient -> A, C.transient -> A`, () => {
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