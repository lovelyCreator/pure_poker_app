import React from "react";
import { useLogger } from "./hooks";
import { LoggerContext } from "./context";
import { type Span } from "./types";

interface SpanWrapperProps {
  name: string;
  span?: Span;
  fields?: any[];
  children: React.ReactNode;
}

export const SpanWrapper: React.FC<SpanWrapperProps> = ({
  name,
  span: providedSpan,
  fields = [],
  children,
}) => {
  const logger = useLogger();
  const parentLogger = providedSpan || logger;

  const span = React.useMemo(() => parentLogger.span(name), [parentLogger, name]);

  const memoizedChildren = React.useMemo(() => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { logger: span });
      }
      return child;
    });
  }, [children, span]);

  return (
    <LoggerContext.Provider value={span}>
      {memoizedChildren}
    </LoggerContext.Provider>
  );
};
