import fs from 'fs';
import path from 'path';

/**
 * Validates if a date is in the correct format (YYYY-MM-DD).
 * @param date The date string to validate.
 * @returns if the date is valid return true.
 */
export function isValidDate(date: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date);
}

/**c
 * Checks if the file exists.
 * @param filePath The path to the file to check.
 * @returns True if the file exists.
 */
export async function doesFileExist(filePath: string): Promise<boolean> {
  const absPath = path.resolve(filePath);
  try {
    await fs.promises.access(absPath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Validates the file existence and date format.
 * @param filePath Path to the file to validate.
 * @param date Date string to validate.
 * @returns A promise that resolves if both validations pass or rejects with an error.
 */
export async function validateFileAndDate(
  filePath: string,
  date: string,
): Promise<void> {
  if (!(await doesFileExist(filePath))) {
    throw new Error(`Error: The file "${filePath}" does not exist.`);
  }

  if (!isValidDate(date)) {
    throw new Error(
      `Error: The date "${date}" is not in the correct format (YYYY-MM-DD).`,
    );
  }
}
