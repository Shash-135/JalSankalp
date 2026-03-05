export const formatTime = (value: string | number | Date) =>
  new Date(value).toLocaleTimeString();
export const formatDate = (value: string | number | Date) =>
  new Date(value).toLocaleDateString();
