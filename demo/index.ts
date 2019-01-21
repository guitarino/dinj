import { createDecorators } from '../src/babel-legacy-decorators';
import { Container, TContainer, Lazy } from "../src";

const container: TContainer = new Container();
const { get, type, hasCircularDependencies } = container;
const { dependency, inject } = createDecorators(container);

const IAClass = type<IAClass>(); // 0
const IBClass = type<IBClass>(); // 1
const ICClass = type<ICClass>(); // 2
const IDClass = type<IDClass>(); // 3
const IEClass = type<IEClass>(IDClass); // 4

interface IAClass { aClassMethod(); };
interface IBClass { something(); };
interface ICClass {};
interface IDClass {};
interface IEClass extends IDClass {};

@dependency(
    IBClass.transient
)
export class BClass implements IBClass {
    something() {
        return 0;
    }
}

@dependency(
    ICClass.singleton
)
@inject(
    IDClass.multi
)
export class CClass implements ICClass {
    private d: IDClass;

    constructor(d) {
        this.d = d;
    }
}

@dependency(
    IDClass
)
@inject(
    IBClass.lazy,
    ICClass.lazy.multi
)
export class DClass implements IDClass {
    private b: Lazy<IBClass>;
    private c: Lazy<ICClass[]>;

    constructor(b, c) {
        this.b = b;
        this.c = c;
    }
}

@dependency(
    IEClass
)
export class EClass extends DClass implements IEClass {}

@dependency(
    IAClass
)
@inject(
    IBClass,
    ICClass.lazy,
    IDClass,
    IDClass.multi
)
export class AClass implements IAClass {
    private b: IBClass;
    private c: Lazy<ICClass>;
    private d: IDClass;
    private e: IDClass[];

    constructor(b, c, d, e) {
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
    }

    aClassMethod() {
        console.log("aClassMethod!!!");
    }
}

console.log('hasCircularDependencies', hasCircularDependencies());

const a = get(IAClass);
a.aClassMethod();

debugger;