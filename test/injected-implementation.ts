import expect from "expect.js";
import { type, dependency, inject, get, getImplementation } from "./shared/container";

const IA = type<IA>();
interface IA {
    getB(): IB;
}

const IB = type<IB>();
interface IB {

}

@dependency(IB)
class B implements IB {
}

@dependency(IA)
@inject(IB)
class A implements IA {
    private readonly b: IB;

    constructor(b: IB) {
        this.b = b;
    }

    getB() {
        return this.b;
    }
}

describe(`Injected implementation`, () => {
    describe(`A -> B`, () => {
        const InjectedA = getImplementation(IA);
        const a = new InjectedA();

        it(`"A" is of correct class`, () => {
            expect(a instanceof A).to.be(true);
        });

        it(`"B" is of correct class`, () => {
            expect(a.getB() instanceof B).to.be(true);
        });
    });
});