import { Command } from 'commander';
import { CliOptions } from './types/interfaces';
import { validateFileAndDate } from './validation/cliValidation';
import { promptforMissingArguments } from './prompts';
import path from 'path';

import AppLogger from './logger/Logger';
import { processCookies } from './utils/procesCookies';

export async function runCLI() {
  const program = new Command();

  program
    .version('1.0.0')
    .description('A CLI tool to process cookies')
    .option('-f, --file <path>', 'Path to the CSV file')
    .option('-d, --date <date>', 'Date of cookie in YYYY-MM-DD format');

  program.parse(process.argv);

  // Parse CLI options and store them in a type-safe object
  let options: Partial<CliOptions> = program.opts();

  // if arguments are missing, prompt user
  options = await promptforMissingArguments(options);

  try {
    // validate file and date together
    await validateFileAndDate(options.file!, options.date!);

    await processCookies(options.file!, options.date!);
  } catch (error) {
    AppLogger.error('Error processing: ', error);
  }
}

runCLI();
