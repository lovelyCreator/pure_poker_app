// useFormattedTimestamp.js
import { useState, useEffect } from 'react';
import { formatTimestamp } from '@/lib/date';

export default function useFormattedTimestamp(timestamp: string) {
  const [formattedTime, setFormattedTime] = useState(() => formatTimestamp(timestamp));

  useEffect(() => {
    if (!timestamp) {
      setFormattedTime('');
      return;
    }

    // Function to update the formatted time
    const updateFormattedTime = () => {
      setFormattedTime(formatTimestamp(timestamp));
    };

    // Initial update
    updateFormattedTime();

    // Determine the update interval based on the timestamp
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();

    let intervalDuration;
    if (diff < 60000) {
      intervalDuration = 3000; // Update every second for the first minute
    } else if (diff < 3600000) {
      intervalDuration = 60000; // Update every minute for the first hour
    } else if (diff < 86400000) {
      intervalDuration = 3600000; // Update every hour for the first day
    } else {
      intervalDuration = 86400000; // Update daily after that
    }

    const interval = setInterval(updateFormattedTime, intervalDuration);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [timestamp]);

  return formattedTime;
}
