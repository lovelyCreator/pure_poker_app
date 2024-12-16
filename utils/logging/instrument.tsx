import React, { useEffect, useRef } from "react";
import { useLogger } from "./hooks";

interface InstrumentProps {
  name: string;
  children: React.ReactNode;
}

export const Instrument: React.FC<InstrumentProps> = ({ name, children }) => {
  const logger = useLogger();
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());

  useEffect(() => {
    const mountDuration = Date.now() - mountTime.current;
    logger.info(`Component ${name} mounted`, { duration: mountDuration });

    return () => {
      const lifetimeDuration = Date.now() - mountTime.current;
      logger.info(`Component ${name} unmounted`, {
        lifetimeDuration,
        totalRenders: renderCount.current,
      });
    };
  }, [logger, name]);

  useEffect(() => {
    renderCount.current += 1;
    logger.info(`Component ${name} rendered`, {
      renderCount: renderCount.current,
    });
  });

  return <>{children}</>;
};
