import { useState, useEffect } from "react";
import { diffAgo } from "@/lib/date";

function useTimeAgo(timestampMs: number | null) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    if (!timestampMs) {
      setTimeAgo("");
      return;
    }

    // Function to update the timeAgo state
    const updateTime = () => {
      const now = Date.now();
      const diff = now - timestampMs;
      setTimeAgo(diffAgo(diff));

      // Determine the next update interval based on the elapsed time
      let nextUpdate: number;
      if (diff < 61000) {
        nextUpdate = 500; // Update every half second for the first minute
      } else if (diff < 3610000) {
        nextUpdate = 60000; // Update every minute for the first hour
      } else if (diff < 86400000) {
        nextUpdate = 3600000; // Update every hour for the first day
      } else {
        nextUpdate = 86400000; // Update daily after that
      }

      // Schedule the next update
      timerId = setTimeout(updateTime, nextUpdate);
    };

    let timerId: ReturnType<typeof setTimeout>;

    // Initial update
    updateTime();

    // Cleanup function to clear the timer when the component unmounts or timestampMs changes
    return () => clearTimeout(timerId);
  }, [timestampMs]);

  return timeAgo;
}

export default useTimeAgo;