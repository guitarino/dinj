import expect from "expect.js";
import { type, configureDependency, get } from "./shared/container";

const IA = type<IA>();
interface IA {
    getBList(): IB[];
}

const IB = type<IB>();
interface IB {
}

class C implements IB {
}

configureDependency()
    .implements(IB)
    .create(C);

class D implements IB {
}

configureDependency()
    .implements(IB)
    .create(D);

class A implements IA {
    private readonly bList: IB[];

    constructor(bList: IB[]) {
        this.bList = bList;
    }

    getBList() {
        return this.bList;
    }
}

configureDependency()
    .implements(IA)
    .inject(IB.multi)
    .create(A);

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