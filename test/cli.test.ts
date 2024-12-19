import { runCLI } from '../src/cli';
import { Command } from 'commander';
import { validateFileAndDate } from '../src/validation/cliValidation';
import { promptforMissingArguments } from '../src/prompts';
import { processCookies } from '../src/utils/procesCookies';
import AppLogger from '../src/logger/Logger';

jest.mock('../src/validation/cliValidation', () => ({
  validateFileAndDate: jest.fn(),
}));

jest.mock('../src/prompts');

jest.mock('../src/utils/procesCookies', () => ({
  processCookies: jest.fn(),
}));

jest.mock('../src/logger/Logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('runCLI with successful validation', () => {
  const testFile = './src/test/resource/test.csv';
  const testDate = '2018-12-25';

  jest.mock('commander', () => ({
    Command: jest.fn().mockImplementation(() => ({
      version: jest.fn().mockReturnThis(),
      description: jest.fn().mockReturnThis(),
      option: jest.fn().mockReturnThis(),
      parse: jest.fn(),
      opts: jest.fn().mockReturnValue({
        file: './src/test/resource/test.csv',
        date: '2018-12-09',
      }),
    })),
  }));

  beforeEach(() => {
    jest.clearAllMocks();

    (promptforMissingArguments as jest.Mock).mockResolvedValue({
      file: testFile,
      date: testDate,
    });

    (processCookies as jest.Mock).mockResolvedValue(['AtY0laUfhglK3lC7']);
  });

  const mockedPromptForMissingArguments =
    promptforMissingArguments as jest.Mock;
  mockedPromptForMissingArguments.mockResolvedValue({
    file: testFile,
    date: '2018-12-25',
  });

  it('should validate input and process cookies', async () => {
    await runCLI();
    expect(validateFileAndDate).toHaveBeenCalledWith(testFile, '2018-12-25');
  });
});

describe('runCLI with failing validation', () => {
  jest.mock('commander', () => ({
    Command: jest.fn().mockImplementation(() => ({
      version: jest.fn().mockReturnThis(),
      description: jest.fn().mockReturnThis(),
      option: jest.fn().mockReturnThis(),
      parse: jest.fn(),
      opts: jest.fn().mockReturnValue({
        file: './resource/test.csv',
        date: '2023-12-01',
      }),
    })),
  }));

  it('should log an error if validation fails', async () => {
    (validateFileAndDate as jest.Mock).mockRejectedValue(
      new Error('Validation error'),
    );

    await runCLI();

    expect(AppLogger.error).toHaveBeenCalledWith(
      'Error processing: ',
      expect.any(Error),
    );
  });
});
