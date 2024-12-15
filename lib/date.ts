export function ago(date: string | Date) {
    const now = new Date().getTime();
    const then = new Date(date).getTime();
    const diff = now - then;
    if (diff < 1000) return "just now";
    if (diff < 1000 * 60)
      return `${Math.floor(diff / 1000)} second${
        Math.floor(diff / 1000) > 1 ? "s" : ""
      } ago`;
    if (diff < 1000 * 60 * 60)
      return `${Math.floor(diff / 1000 / 60)} minute${
        Math.floor(diff / 1000 / 60) > 1 ? "s" : ""
      } ago`;
    if (diff < 1000 * 60 * 60 * 24)
      return `${Math.floor(diff / 1000 / 60 / 60)}h`;
    if (diff < 1000 * 60 * 60 * 24 * 7)
      return `${Math.floor(diff / 1000 / 60 / 60 / 24)} day${
        Math.floor(diff / 1000 / 60 / 60 / 24) > 1 ? "s" : ""
      } ago`;
    if (diff < 1000 * 60 * 60 * 24 * 30)
      return `${Math.floor(diff / 1000 / 60 / 60 / 24 / 7)} week${
        Math.floor(diff / 1000 / 60 / 60 / 24 / 7) > 1 ? "s" : ""
      } ago`;
    return `${Math.floor(diff / 1000 / 60 / 60 / 24 / 30)} month${
      Math.floor(diff / 1000 / 60 / 60 / 24 / 30) > 1 ? "s" : ""
    } ago`;
  }
  
  export function diffAgo(diff: number): string {
    const seconds = Math.trunc(diff / 1000);
    if (seconds < 1) return "just now";
    if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  
    const minutes = Math.trunc(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  
    const hours = Math.trunc(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
  
    const days = Math.trunc(hours / 24);
    if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  
    const weeks = Math.trunc(days / 7);
    if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  
    const months = Math.trunc(days / 30);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }
  
  export function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
  
    const nowTime = new Date().getTime();
    const then = new Date(timestamp).getTime();
    const diff = nowTime - then;
    if (diff < 1000) return "just now";
    if (diff < 1000 * 60)
      return `${Math.floor(diff / 1000)} second${
        Math.floor(diff / 1000) > 1 ? "s" : ""
      } ago`;
  
    const isToday = date.toDateString() === now.toDateString();
  
    // Check if it is yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
  
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const timeString = date.toLocaleTimeString(undefined, options);
  
    if (isToday) {
      return `Today at ${timeString}`;
    } else if (isYesterday) {
      return `Yesterday at ${timeString}`;
    } else {
      const dateString = date.toLocaleDateString(undefined, {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      return `${dateString} at ${timeString}`;
    }
  }