import { fake } from "sinon";
import expect from "expect.js";
import { type, dependency, inject, get } from "./container";
import { Lazy } from "../src";

const IA = type<IA>();
interface IA {
    getB(): IB;
}

const IB = type<IB>();
interface IB {

}

const bConstructorFake = fake();

@dependency(IB)
class B implements IB {
    constructor() {
        bConstructorFake();
    }
}

@dependency(IA)
@inject(IB.lazy)
class A implements IA {
    private readonly b: Lazy<IB>;

    constructor(b: Lazy<IB>) {
        this.b = b;
    }

    getB() {
        return this.b.value;
    }
}

describe(`Lazy dependency injection`, () => {
    describe(`A -> Lazy<B>`, () => {
        const a = get(IA);

        it(`"B" is not obtained before method is called`, () => {
            expect(bConstructorFake.callCount).to.be(0);
        });

        it(`obtains "B" via method`, () => {
            expect(a.getB() instanceof B).to.be(true);
        });

        it(`"B" is obtained after method call`, () => {
            expect(bConstructorFake.callCount).to.be(1);
        });
    });
});