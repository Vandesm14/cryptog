import { parse } from 'https://deno.land/std/flags/mod.ts';

const args = parse(Deno.args);
const pattern = String(args._[0]);
const exclude: string[] = args?.exclude?.split('') ?? [];

interface Word {
  text: string;
  frequency: number;
}

const getWords = (path: string): Word[] => {
  const text = Deno.readTextFileSync(path);
  const lines = text
    .split(/\r?\n/g)
    .slice(1)
    .map((line) => {
      const values = line.split(',');
      const formatted = { text: values[0], frequency: Number(values[1]) };
      return formatted;
    });

  return lines;
};

const filter = (words: Word[], pattern: string) =>
  words
    .filter(
      (word) =>
        new RegExp(pattern).test(word.text) &&
        word.text.length === pattern.length &&
        exclude.every(
          (letter) =>
            word.text.indexOf(letter) === -1 || pattern.indexOf(letter) !== -1
        )
    )
    .map((word) => word.text);

const words = getWords(
  `${new URL('.', import.meta.url).pathname}/unigram_freq.csv`
);

const results = filter(words, pattern)
  .map((word, i) => `${i + 1}: ${word}`)
  .reverse()
  .join('\n');

console.log(results);
