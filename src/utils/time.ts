
export const getRelativeTime = (targetDate: string): string => {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const diff = target - now;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h${minutes}m`;
};
