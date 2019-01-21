import {
    TRegexBuilder,
    THTMLDynamicObject,
    TTemplateStringParser,
    THTMLTemplateParser,
    THTMLParserApp
} from "./Parsers.types";
import { inject, singleton, transient, dependency } from "../container";

export const hooks = {
    RegexBuilder: {
        constructor: ()=>{}
    },
    TemplateStringParser: {
        constructor: ()=>{}
    },
    HTMLTemplateParser: {
        constructor: ()=>{}
    },
    HTMLParserApp: {
        constructor: ()=>{}
    }
};

@dependency(TRegexBuilder) @transient
class RegexBuilder implements TRegexBuilder {
    constructor() {
        hooks.RegexBuilder.constructor.call(this);
    }
    create() { return /^$/ };
    lookbehind() { return this; }
    lookahead() { return this; }
    anything() { return this; }
    anythingBut() { return this; }
    anythingButSymbols() { return this; }
    startGroup() { return this; }
    endGroup() { return this; }
    matches() { return this; }
    matchesSymbols() { return this; }
    repeats() { return this; }
}

@dependency(TTemplateStringParser) @singleton
class TemplateStringParser implements TTemplateStringParser {
    @inject(TRegexBuilder)
    private rb: TRegexBuilder;

    constructor() {
        hooks.TemplateStringParser.constructor.call(this);
    }

    parse(input: string) {
        const staticParts: string[] = [];
        const dynamicParts: string[] = [];
        const result: [string[], string[]] = [staticParts, dynamicParts];
        return result;
    };
}

@dependency(THTMLParserApp)
class HTMLTemplateParser implements THTMLTemplateParser {
    @inject(TTemplateStringParser)
    private templateStringParser: TTemplateStringParser;

    constructor() {
        hooks.HTMLTemplateParser.constructor.call(this);
    }

    parse(input: string) {
        let rootHTMLElement: HTMLElement = null as unknown as HTMLElement;
        const dynamicParts: THTMLDynamicObject[] = [];
        const result: [HTMLElement, THTMLDynamicObject[]] = [rootHTMLElement, dynamicParts];
        return () => result;
    };
}

@dependency(THTMLParserApp)
class HTMLParserApp implements THTMLParserApp {
    @inject(TTemplateStringParser)
    private htmlTemplateParser: THTMLTemplateParser;

    constructor() {
        hooks.HTMLParserApp.constructor.call(this);
    }

    create() {
        throw new Error("Method not implemented.");
    }
}