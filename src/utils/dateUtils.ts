export function getFormattedDate(date: Date): string {
  // US English uses month-day-year order
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "long",
    year: "numeric",
  }).format(date);
}
