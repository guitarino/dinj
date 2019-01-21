import { type } from "../container";

export const TRegexBuilder = type();
export interface TRegexBuilder {
    create: () => RegExp,
    lookbehind: (value: string) => TRegexBuilder,
    lookahead: (value: string) => TRegexBuilder,
    anything: (value: string) => TRegexBuilder,
    anythingBut: (value: string) => TRegexBuilder,
    anythingButSymbols: (value: string) => TRegexBuilder,
    startGroup: () => TRegexBuilder,
    endGroup: () => TRegexBuilder,
    matches: () => TRegexBuilder,
    matchesSymbols: () => TRegexBuilder,
    repeats: (from: number, to: number) => TRegexBuilder
}

export const TParser = () => type();
export interface TParser<TInput, TOutput> {
    parse: (input: TInput) => TOutput
}

export const TStringToArrayParser = TParser();
export type TStringToArrayParser = TParser<string, [string[], string[]]>;

export const TTemplateStringParser = type(TStringToArrayParser);
export type TTemplateStringParser = TStringToArrayParser;

export type THTMLDynamicObject = {
    setValue: (value: string) => void;
};

export const THTMLTemplateParser = TParser();
export type THTMLTemplateParser = TParser<string, () => [HTMLElement, THTMLDynamicObject[]]>;

export const THTMLParserApp = type();
export interface THTMLParserApp {
    create();
}
