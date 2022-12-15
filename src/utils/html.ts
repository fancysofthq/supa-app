/**
 * Convert a date to a string that can be used
 * as the value of an input type="date".
 */
export function date2InputDate(date: Date | undefined): string {
  if (date === undefined) return "";

  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0")
  );
}
