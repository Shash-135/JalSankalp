export const formatTime = (date: string | number | Date) => {
  const d = new Date(date);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export const formatDurationHours = (ms: number) => {
  const hours = ms / (1000 * 60 * 60);
  return `${hours.toFixed(1)} hrs`;
};
