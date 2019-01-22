import { createDecorators } from '../src/babel-legacy-decorators';
import { createContainer, TContainer, Lazy } from "../src";

const container: TContainer = createContainer();
const { get, type, hasCircularDependencies } = container;
const { dependency, inject } = createDecorators(container);

const IAClass = type<IAClass>(); // 0
const IBClass = type<IBClass>(); // 1
const ICClass = type<ICClass>(); // 2
const IDClass = type<IDClass>(); // 3
const IEClass = type<IEClass>(IDClass); // 4

interface IAClass {};
interface IBClass {};
interface ICClass {};
interface IDClass {};
interface IEClass extends IDClass {};

@dependency(
    IBClass.transient
)
export class BClass implements IBClass {
}

@dependency(
    ICClass.singleton
)
@inject(
    IDClass.multi
)
export class CClass implements ICClass {
    private readonly d: IDClass[];

    constructor(d: IDClass[]) {
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
    private readonly b: Lazy<IBClass>;
    private readonly c: Lazy<ICClass[]>;

    constructor(b: Lazy<IBClass>, c: Lazy<ICClass[]>) {
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
    private readonly b: IBClass;
    private readonly c: Lazy<ICClass>;
    private readonly d: IDClass;
    private readonly e: IDClass[];

    constructor(b: IBClass, c: Lazy<ICClass>, d: IDClass, e: IDClass[]) {
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
    }
}

console.log('hasCircularDependencies', hasCircularDependencies());

const a = get(IAClass);

debugger;