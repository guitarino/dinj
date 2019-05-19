import expect from "expect.js";
import { type, configureDependency } from "./shared/container";

const IA = type<IA>();
interface IA {
    n1: number,
    n2: number,
    getB(): IB;
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
    private readonly b: IB;
    n1: number;
    n2: number;

    constructor(b: IB, n1: number, n2: number) {
        this.b = b;
        this.n1 = n1;
        this.n2 = n2;
    }

    getB() {
        return this.b;
    }
}

const InjectedA = configureDependency()
    .implements(IA)
    .inject(IB)
    .create(A);

describe(`Injected implementation`, () => {
    describe(`A -> B`, () => {
        const a = new InjectedA(100, 500);

        it(`"A" is of correct class`, () => {
            expect(a instanceof A).to.be(true);
        });

        it(`Arguments to "A" are passed down correctly`, () => {
            expect(a.n1).to.be(100);
            expect(a.n2).to.be(500);
        });

        it(`"B" is of correct class`, () => {
            expect(a.getB() instanceof B).to.be(true);
        });
    });
});