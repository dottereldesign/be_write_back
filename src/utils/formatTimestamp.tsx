// src/utils/formatTimestamp.tsx

export function formatTimestamp(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-NZ", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
