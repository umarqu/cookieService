import fs from 'fs';
import { CookieRecord } from '../types/interfaces';
import { doesFileExist } from '../validation/cliValidation';

/**
 * Reads a csv file and uses its content into an array
 * @param filePath The path to csv file
 * @returns Parsed cookie records from the csv file
 */

export function readCsvFile(filePath: string): CookieRecord[] {
  if (!doesFileExist(filePath)) {
    throw new Error(`File does not exist.`);
  }

  const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

  const rows = fileContent.trim().split('\n');
  const [header, ...dataRows] = rows;

  if (!header) throw new Error('CSV file is empty or has invalid structure.');

  const cookieRecords: CookieRecord[] = dataRows.map((row) => {
    const [cookieId, timestamp] = row.split(',');

    if (!cookieId || !timestamp) {
      throw new Error(`Invalid row format: ${row}`);
    }

    return {
      cookieId,
      timestamp: new Date(timestamp),
    };
  });

  return cookieRecords;
}
