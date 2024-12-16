import React from "react";
import { LoggerContext } from "./context";
import { type Span } from "./types";

export function useLogger(): Span {
  return React.useContext(LoggerContext);
}

export function useSpan(name: string, fields: any = []): Span {
  const parentSpan = useLogger();
  return React.useMemo(() => parentSpan.span(name, fields), [parentSpan, name]);
}
