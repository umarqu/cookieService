import { processCookies } from '../../src/utils/procesCookies';
import { readCsvFile } from '../../src/utils/fileReader';
import {
  filterCookiesByDate,
  findRepeatedCookieOccurences,
} from '../../src/utils/cookieFilter';
import AppLogger from '../../src/logger/Logger';

jest.mock('../../src/utils/fileReader', () => ({
  readCsvFile: jest.fn(),
}));

jest.mock('../../src/utils/cookieFilter', () => ({
  filterCookiesByDate: jest.fn(),
  findRepeatedCookieOccurences: jest.fn(),
}));

jest.mock('../../src/logger/Logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe.only('processCookies', () => {
  const testFilePath = './test/resource/cookies.csv';
  const testDate = '2023-12-01';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log the most repeated cookie from a valid file and valid date', async () => {
    const mockCookieLogs = [
      { cookieId: 'abc', timestamp: new Date('2024-12-18T10:00:00Z') },
      { cookieId: 'abc', timestamp: new Date('2024-12-18T12:00:00Z') },
      { cookieId: 'xyz', timestamp: new Date('2024-12-18T13:00:00Z') },
    ];
    const filteredCookies = [
      { cookieId: 'abc', timestamp: new Date('2024-12-18T10:00:00Z') },
      { cookieId: 'abc', timestamp: new Date('2024-12-18T12:00:00Z') },
    ];

    (readCsvFile as jest.Mock).mockReturnValue(mockCookieLogs);
    (filterCookiesByDate as jest.Mock).mockReturnValue(filteredCookies);
    (findRepeatedCookieOccurences as jest.Mock).mockReturnValue('abc');

    await processCookies(testFilePath, testDate);

    // Verify the calls
    expect(readCsvFile).toHaveBeenCalledWith(testFilePath);
    expect(filterCookiesByDate).toHaveBeenCalledWith(mockCookieLogs, testDate);
    expect(findRepeatedCookieOccurences).toHaveBeenCalledWith(filteredCookies);

    // Verify the logger
    expect(AppLogger.info).toHaveBeenCalledWith('abc');
  });

  it('should log a message if no repeated cookie is found', async () => {
    const mockCookieLogs = [
      { cookieId: 'abc', timestamp: new Date('2024-12-17T10:00:00Z') },
      { cookieId: 'xyz', timestamp: new Date('2024-12-17T12:00:00Z') },
    ];
    const filteredCookies = [
      { cookieId: 'abc', timestamp: new Date('2024-12-17T10:00:00Z') },
    ];

    (readCsvFile as jest.Mock).mockReturnValue(mockCookieLogs);
    (filterCookiesByDate as jest.Mock).mockReturnValue(filteredCookies);
    (findRepeatedCookieOccurences as jest.Mock).mockReturnValue(null);

    await processCookies(testFilePath, testDate);

    // Verify the logger
    expect(AppLogger.info).toHaveBeenCalledWith(
      'There isn’t a most repeated cookie for this date.',
    );
  });

  it('should log an error if an exception occurs', async () => {
    const error = new Error('File not found');
    (readCsvFile as jest.Mock).mockImplementation(() => {
      throw error;
    });

    await processCookies(testFilePath, testDate);

    // Verify the logger
    expect(AppLogger.error).toHaveBeenCalledWith(
      'Error processing cookies:',
      error,
    );
  });
});
