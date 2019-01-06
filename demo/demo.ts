import { DIContainer, TypeIdentifier, injectable } from "../src/main";

const container = new DIContainer();

const MyInterface = TypeIdentifier();

interface MyInterface {

}

class MyClass {

}

container.register(MyClass).as<MyInterface>(MyInterface);

const AnotherClass = injectable(
    MyInterface
)(class {
    private readonly myClassInstance: MyInterface;

    constructor(myClassInstance: MyInterface) {
        this.myClassInstance = myClassInstance;
    }
});

debugger;