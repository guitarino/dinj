import { fake } from "sinon";
import expect from "expect.js";
import { type, dependency, inject, get } from "./container";
import { Lazy } from "../src";

const IA = type<IA>();
interface IA {
    getBList(): IB[];
}

const IB = type<IB>();
interface IB {
}

const cConstructorFake = fake();

@dependency(type(IB))
class C implements IB {
    constructor() {
        cConstructorFake();
    }
}

const dConstructorFake = fake();

@dependency(type(IB))
class D implements IB {
    constructor() {
        dConstructorFake();
    }
}

@dependency(IA)
@inject(IB.lazy.multi)
class A implements IA {
    private readonly bList: Lazy<IB[]>;

    constructor(bList: Lazy<IB[]>) {
        this.bList = bList;
    }

    getBList() {
        return this.bList.value;
    }
}

describe(`Multi dependency injection`, () => {
    describe(`A -> Lazy<B[] {C, D}>`, () => {
        const a = get(IA);

        it(`"B" dependencies are not obtained before method is called`, () => {
            expect(cConstructorFake.callCount).to.be(0);
            expect(dConstructorFake.callCount).to.be(0);
        });
        
        it(`"B" dependencies are of correct classes`, () => {
            const bList = a.getBList();
            let cCount = 0;
            let dCount = 0;
            bList.forEach(b => {
                if (b instanceof C) {
                    cCount++;
                }
                else if (b instanceof D) {
                    dCount++;
                }
            });
            expect(cCount).to.be(1);
            expect(dCount).to.be(1);
        });

        it(`"B" dependencies are obtained after method is called`, () => {
            expect(cConstructorFake.callCount).to.be(1);
            expect(dConstructorFake.callCount).to.be(1);
        });
    });
});