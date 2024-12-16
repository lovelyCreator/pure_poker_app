import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { Logger } from './logger'; // Ensure you have the Logger class defined
import { LogLevel, Span } from './types'; // Import necessary types

// Create a context for the logger
export const LoggerContext = createContext<Span>(new Logger("info"));

// LoggerProvider component
export const LoggerProvider: React.FC<{
  children: ReactNode;
  level: LogLevel;
}> = ({ children, level }) => {
  const logger = useMemo(() => new Logger(level), [level]);

  return (
    <LoggerContext.Provider value={logger}>
      {children}
    </LoggerContext.Provider>
  );
};

// Custom hook to access the logger context
export const useLogger = (): Span => {
  const context = useContext(LoggerContext);
  if (!context) {
    throw new Error("useLogger must be used within a LoggerProvider");
  }
  return context;
};
