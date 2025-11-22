// Format Form
export function localDate(dateStr: string | Date): string {
  if (!dateStr) return ""; // not null/undefined

  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  if (isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().split("T")[0];
}

// Format UI
export function formatDate(input?: string | Date): string {
  if (!input) return ""; // not null/undefined

  const utcDate = new Date(input);
  if (isNaN(utcDate.getTime())) return "";

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Makassar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(utcDate);
}
