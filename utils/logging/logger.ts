import { type Span, type Parent, type LogLevel, type LevelInt } from "./types";

const RootParent: Parent = null;

const levels: Record<LogLevel, LevelInt> = {
  off: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

// Type for log functions
type LogFunction = (...data: any[]) => void;

// Function to create log functions
function createLogFunction(consoleMethod: LogFunction, level: LogLevel): LogFunction {
  const num_level = levels[level];
  const d_level = level.toUpperCase();
  
  return function (this: Span, ...args: any[]): void {
    if (this.level >= num_level) {
      consoleMethod(`[${d_level}]`, ...args, ...this.format());
    }
  };
}

// Logger class implementing Span
export class Logger implements Span {
  parent = RootParent;
  name = "root";
  level: LevelInt;

  constructor(level: LogLevel) {
    this.level = levels[level];
  }

  format = (): any[] => [];

  trace: LogFunction = createLogFunction(console.trace, "trace");
  debug: LogFunction = createLogFunction(console.debug, "debug");
  info: LogFunction = createLogFunction(console.info, "info");
  warn: LogFunction = createLogFunction(console.warn, "warn");
  error: LogFunction = createLogFunction(console.error, "error");

  setFields = (fields: any[]): void => {
    this.debug(
      "Attempted to set fields on Logger rather than CurrentSpan, this does nothing.",
      fields,
    );
  };

  span = (name: string, fields: any = []): CurrentSpan => {
    return new CurrentSpan(name, this, this.level, fields);
  };
}

// CurrentSpan class implementing Span
export class CurrentSpan implements Span {
  name: string;
  parent: Span;
  level: LevelInt;
  fields: any;

  constructor(name: string, parent: Span, level: LevelInt, fields: any) {
    this.name = name;
    this.parent = parent;
    this.level = level;
    this.fields = fields;
  }

  fmtFields = (): any[] => {
    if (this.fields.length === 0) {
      return [];
    }
    return [" with: ", this.fields];
  };

  format = (): any[] => {
    return [
      "\n    in ",
      this.name,
      ...this.fmtFields(),
      ...this.parent.format(),
    ];
  };

  trace: LogFunction = createLogFunction(console.trace, "trace");
  debug: LogFunction = createLogFunction(console.debug, "debug");
  info: LogFunction = createLogFunction(console.info, "info");
  warn: LogFunction = createLogFunction(console.warn, "warn");
  error: LogFunction = createLogFunction(console.error, "error");

  setFields = (fields: any): void => {
    this.fields = fields;
  };

  span = (name: string, fields: any = []): CurrentSpan => {
    return new CurrentSpan(name, this, this.level, fields);
  };
}
