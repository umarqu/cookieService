import inquirer from 'inquirer';
import { CliOptions } from './types/interfaces';

export async function promptforMissingArguments(option: Partial<CliOptions>) {
  const response = await inquirer.prompt([
    {
      name: 'file',
      message: 'Enter the path to the csv',
      type: 'input',
      when: () => !option.file,
    },
    {
      name: 'date',
      message: 'Enter a date (YYYY-MM-DD):',
      type: 'input',
      when: () => !option.date,
    },
  ]);

  return {
    file: response.file || option.file!,
    date: response.date || option.date!,
  };
}
