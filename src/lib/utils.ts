import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToRupiah(value: number): string {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  return formatter.format(value);
}

export function parseCurrency(value: string): number {
  const cleanedValue = value.replace(/[^0-9]/g, "");
  return parseFloat(cleanedValue) || 0;
}

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function getRandomNumber(min: number, max: number): number {
  if (min > max) {
    throw new Error("Minimum value cannot be greater than maximum value.");
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
