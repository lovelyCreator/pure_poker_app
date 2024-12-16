import React from "react";
import { LoggerContext } from "./context";
import { type Span } from "./types";

interface SpanInheritorProps {
  span: Span;
  children: React.ReactNode;
}

export const SpanInheritor: React.FC<SpanInheritorProps> = ({
  span,
  children,
}) => {
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
