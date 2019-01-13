import { Container, createDecorators, TSetup } from "../src";

const container = new Container();
const { type, hasCircularDependencies } = container;
const { dependency, inject, lazy, multi, singleton, transient } = createDecorators(container);

const IAClass = type(); // 0
const IBClass = type(); // 1
const ICClass = type(); // 2
const IDClass = type(); // 3
const IEClass = type(IDClass); // 4

interface IAClass {};
interface IBClass {};
interface ICClass {};
interface IDClass {};
interface IEClass extends IDClass {};

@dependency(IBClass) @transient
class BClass implements IBClass {}

@dependency(ICClass) @singleton
class CClass implements ICClass {
    @inject(IDClass) @multi
    private d: IDClass;
}

@dependency(IDClass)
class DClass implements IDClass {
    @inject(IBClass) @lazy
    private b: IBClass;

    @inject(ICClass) @multi
    private c: ICClass;
}

@dependency(IEClass)
class EClass extends DClass implements IEClass {}

@dependency(IAClass)
class AClass {
    @inject(IBClass)
    private b: IBClass;

    @inject(ICClass) @lazy
    private c: ICClass;

    @inject(IDClass)
    private d: IDClass;

    @inject(IEClass) @multi
    private e: IDClass;

    constructor(setup?: TSetup) {
    }
}

console.log('hasCircularDependencies', hasCircularDependencies());

const a = new AClass();

debugger;