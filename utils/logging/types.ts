export interface Span {
    parent: Parent;
    name: string;
    level: LevelInt;
    // eslint-disable-next-line
    trace: (message: string, ...args: any[]) => void;
    // eslint-disable-next-line
    debug: (message: string, ...args: any[]) => void;
    // eslint-disable-next-line
    info: (message: string, ...args: any[]) => void;
    // eslint-disable-next-line
    warn: (message: string, ...args: any[]) => void;
    // eslint-disable-next-line
    error: (message: string, ...args: any[]) => void;
    // eslint-disable-next-line
    format: () => any[];
    // eslint-disable-next-line
    setFields: (fields: any) => void;
    // eslint-disable-next-line
    span: (name: string, fields?: any) => Span;
  }
  
  // prevent cyclic type definition with null for root.
  export type Parent = null | Span;
  export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "off";
  
  type Enumerate<
    N extends number,
    Acc extends number[] = [],
  > = Acc["length"] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc["length"]]>;
  
  type IntRange<F extends number, T extends number> = Exclude<
    Enumerate<T>,
    Enumerate<F>
  >;
  
  export type LevelInt = IntRange<0, 6>;
  