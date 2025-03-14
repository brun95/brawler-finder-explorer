export const getRelativeTime = (targetDate: string): string => {
  const now    = Date.now();
  const target = new Date(targetDate).getTime();
  const diff   = target - now;

  if (diff <= 0) return "0m"; // Handle past events

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (totalHours >= 24) {
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return `${days}d ${hours}h`;
  } else {
    return `${totalHours}h ${minutes}m`;
  }
};