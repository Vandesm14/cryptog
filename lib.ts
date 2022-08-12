import { __dirname } from './shared.ts';

const getWords = (path: string): string[] => {
  const text = Deno.readTextFileSync(path);
  const lines = text
    .split(/\r?\n/g)
    .slice(1)
    .map((line) => line.split(',')[0]);

  return lines;
};

export const filter = (words: string[], exclude: string[], pattern: string) =>
  words
    .filter(
      (word) =>
        new RegExp(pattern).test(word) &&
        word.length === pattern.length &&
        exclude.every(
          (letter) =>
            word.indexOf(letter) === -1 || pattern.indexOf(letter) !== -1
        )
    )
    .map((word) => word);

export const words = getWords(`${__dirname}/unigram_freq.csv`);
