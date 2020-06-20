declare class Parser {
  constructor(p: string);
  static init(
    node: string,
    ns: string,
    command: string,
    args: any[]
  ):{
    namespace: string,
    command: string,
    args: any[]
  };
  _assertNotAlreadyRegistered(longHand: string, shortHand?: string): void;
  argument(
    name: string,
    opts: any
  ): any;
  parameter(
    name: string,
    opts: any
  ): any;
  flag(
    name: string,
    opts: any
  ): any;
  castToType(
    value: string,
    type: string
  ): any;
  parseArguments(args: any[]): any;
  parseFlags(args: any[]): any;
  parseParameters(args: any[]): any;
  parse(ctx: any): Promise<any>
}

export = Parser;
