import { CookieRecord } from '../types/interfaces';

/**
 * Filters cookies by a specific date.
 * @param cookieRecords Array of `CookieRecord` objects to filter.
 * @param date Date in YYYY-MM-DD format to match against.
 * @returns Array of cookie IDs that match the specified date.
 */
export function filterCookiesByDate(
  cookieRecord: CookieRecord[],
  date: string,
): string[] {
  const targetDate = new Date(date);

  const filteredCookies = cookieRecord
    .filter((record) => {
      const recordDate = record.timestamp;

      return (
        recordDate.getUTCFullYear() === targetDate.getUTCFullYear() &&
        recordDate.getUTCMonth() === targetDate.getUTCMonth() &&
        recordDate.getUTCDate() === targetDate.getUTCDate()
      );
    })
    .map((record) => record.cookieId);

  return filteredCookies;
}

/**
 * Finds the most frequently occurring cookie ID in an array using Map.
 * @param cookieIds Array of cookie IDs to analyze.
 * @returns The most repeated cookie ID.
 */
export function findRepeatedCookieOccurences(
  cookieIds: string[],
): string | null {
  const cookieCount = new Map<string, number>();

  for (const id of cookieIds) {
    cookieCount.set(id, (cookieCount.get(id) || 0) + 1);
  }

  // Find the most repeated cookie ID
  let mostRepeatedCookie: string | null = null;
  let maxCount = 0;

  for (const [cookieId, count] of cookieCount.entries()) {
    if (count > maxCount && count !=1) {
      maxCount = count;
      mostRepeatedCookie = cookieId;
    }
  }

  return mostRepeatedCookie;
}
