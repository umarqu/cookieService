import { readCsvFile } from '../utils/fileReader';
import { filterCookiesByDate } from '../utils/cookieFilter';
import { findRepeatedCookieOccurences } from '../utils/cookieFilter';
import AppLogger from '../logger/Logger';

/**
 * Processes cookies for given file and date.
 * @param filePath Path to the CSV cookie
 * @param date Date in YYYY-MM-DD format to filter cookies by.
 */
export async function processCookies(
  filePath: string,
  date: string,
): Promise<void> {
  try {
    // Read and parse the CSV file into memory
    const cookieLogs = readCsvFile(filePath);

    // Filter cookies by the provided date
    const filteredCookies = filterCookiesByDate(cookieLogs, date);

    // Find the most repeated cookie
    const mostRepeatedCookie = findRepeatedCookieOccurences(filteredCookies);

    // Log the results
    if (mostRepeatedCookie) {
      AppLogger.info(mostRepeatedCookie);
    } else {
      AppLogger.info('There isn’t a most repeated cookie for this date.');
    }
  } catch (error) {
    AppLogger.error('Error processing cookies:', error);
  }
}
