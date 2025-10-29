import * as acorn from 'acorn';

export declare class TokContext {
  constructor(
    token: string,
    isExpr: boolean,
    preserveSpace: boolean,
    override?: (parser: any) => void
  )
}

export interface JsxTokTypes extends AcornTokTypes {
  jsxName: acorn.TokenType,
  jsxText: acorn.TokenType,
  jsxTagEnd: acorn.TokenType,
  jsxTagStart: acorn.TokenType
}

export type AcornTokTypes = typeof acorn.tokTypes;

export type TokTypes = JsxTokTypes

export interface Options {
    allowNamespacedObjects?: boolean;
    allowNamespaces?: boolean;
}

export interface TokContexts {
    tc_oTag: TokContext,
    tc_cTag: TokContext,
    tc_expr: TokContext
}

// We pick (statics) from acorn rather than plain extending to avoid complaint
//   about base constructors needing the same return type (i.e., we return
//   `AcornJsxParser` here)
export interface AcornJsxParserCtor extends Pick<typeof acorn.Parser, keyof typeof acorn.Parser> {
    readonly acornJsx: {
        tokTypes: TokTypes;
        tokContexts: TokContexts
    };

    new (options: acorn.Options, input: string, startPos?: number): AcornJsxParser;
}

export interface AcornJsxParser extends acorn.Parser {
    jsx_readToken(): string;
    jsx_readNewLine(normalizeCRLF: boolean): void;
    jsx_readString(quote: number): void;
    jsx_readEntity(): string;
    jsx_readWord(): void;
    jsx_parseIdentifier(): acorn.Node;
    jsx_parseNamespacedName(): acorn.Node;
    jsx_parseElementName(): acorn.Node | string;
    jsx_parseAttributeValue(): acorn.Node;
    jsx_parseEmptyExpression(): acorn.Node;
    jsx_parseExpressionContainer(): acorn.Node;
    jsx_parseAttribute(): acorn.Node;
    jsx_parseOpeningElementAt(startPos: number, startLoc?: acorn.SourceLocation): acorn.Node;
    jsx_parseClosingElementAt(startPos: number, startLoc?: acorn.SourceLocation): acorn.Node;
    jsx_parseElementAt(startPos: number, startLoc?: acorn.SourceLocation): acorn.Node;
    jsx_parseText(): acorn.Node;
    jsx_parseElement(): acorn.Node;
}

export interface JsxFunctionProperties {
  tokTypes: JsxTokTypes;
}

export type JsxFunctionSignature = (options?: Options) => (BaseParser: typeof acorn.Parser) => AcornJsxParserCtor

export type JsxFunction = JsxFunctionSignature & JsxFunctionProperties;

declare const jsx: JsxFunction;

export default jsx;
