import * as acorn from 'acorn';

declare class TokContext {
  constructor(
    token: string,
    isExpr: boolean,
    preserveSpace: boolean,
    override?: (parser: any) => void
  )
}

interface JsxTokTypes extends AcornTokTypes {
  jsxName: acorn.TokenType,
  jsxText: acorn.TokenType,
  jsxTagEnd: acorn.TokenType,
  jsxTagStart: acorn.TokenType
}

type AcornTokTypes = typeof acorn.tokTypes;

declare function jsx(options?: jsx.Options): (BaseParser: typeof acorn.Parser) => jsx.AcornJsxParserCtor;

declare namespace jsx {
  const tokTypes: JsxTokTypes;

  type TokTypes = JsxTokTypes

  interface Options {
    allowNamespacedObjects?: boolean;
    allowNamespaces?: boolean;
  }

  // As per https://github.com/acornjs/acorn/issues/1404 ,
  //   acorn is not exporting all of its interface for plugin
  //   authors, so we add this class here ourselves
  class TokContext {
    constructor(
      token: string,
      isExpr: boolean,
      preserveSpace: boolean,
      override?: (parser: any) => void
    )
  }

  interface TokContexts {
    tc_oTag: TokContext,
    tc_cTag: TokContext,
    tc_expr: TokContext
  }

  // We pick (statics) from acorn rather than plain extending to avoid complaint
  //   about base constructors needing the same return type (i.e., we return
  //   `AcornJsxParser` here)
  interface AcornJsxParserCtor extends Pick<typeof acorn.Parser, keyof typeof acorn.Parser> {
    readonly acornJsx: {
      tokTypes: TokTypes;
      tokContexts: TokContexts
    };

    new (options: acorn.Options, input: string, startPos?: number): AcornJsxParser;
  }

  interface AcornJsxParser extends acorn.Parser {
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
}

export = jsx;
