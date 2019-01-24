import expect from "expect.js";
import { type, dependency, inject, get } from "./container";

const IA = type<IA>();
interface IA {
    getBList(): IB[];
}

const IB = type<IB>();
interface IB {
}

@dependency(IB)
class C implements IB {
}

@dependency(IB)
class D implements IB {
}

@dependency(IA)
@inject(IB.multi)
class A implements IA {
    private readonly bList: IB[];

    constructor(bList: IB[]) {
        this.bList = bList;
    }

    getBList() {
        return this.bList;
    }
}

describe(`Multi dependency injection`, () => {
    describe(`A -> B[] {C, D}`, () => {
        const a = get(IA);
        const bList = a.getBList();
        
        it(`"B" dependencies are of correct classes`, () => {
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
    });
});