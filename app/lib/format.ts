/**
 * Shared formatting utilities for Vertex course and lesson data.
 */

export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "—";
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!hours) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export function formatStudentCount(count: number | null | undefined): string {
  if (!count) return "—";
  return count >= 1000
    ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`
    : count.toLocaleString();
}

export function titleCase(value: string | null | undefined): string {
  if (!value) return "";
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
