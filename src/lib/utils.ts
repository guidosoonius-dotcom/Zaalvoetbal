import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "2022-2023" -> "22-23", for tight chart x-axis ticks. Leaves other labels untouched. */
export function shortenSeasonLabel(label: string): string {
  const match = label.match(/^(\d{4})-(\d{4})$/);
  if (!match) return label;
  return `${match[1].slice(2)}-${match[2].slice(2)}`;
}
