import { filter, inc, words } from './lib.ts';
import * as c from 'https://deno.land/std@0.152.0/fmt/colors.ts';

export const getSmallestWords = (words: string[]): string[] => {
  const sorted = words.sort((a, b) => a.length - b.length);
  const small = sorted.filter((word) => word.length === sorted[0].length);
  const smallest = small[0];
  return small.filter((word) => word.length === smallest.length);
};

export const getMostInfluentialWord = (words: string[], test: string[]) => {
  const letters = new Map<string, number>();
  words.forEach((word) =>
    word.split('').forEach((letter) => inc(letters, letter))
  );
  const sorted = test.sort((a, b) => {
    const scoreA = a
      .split('')
      .reduce(
        (prev, letter) =>
          prev + (letters.has(letter) ? letters.get(letter)! : 0),
        0
      );
    const scoreB = b
      .split('')
      .reduce(
        (prev, letter) =>
          prev + (letters.has(letter) ? letters.get(letter)! : 0),
        0
      );
    return scoreB - scoreA;
  });
  return sorted[0];
};

export const getMostFinishedWord = (
  words: string[],
  relations: Map<string, string>
) => {
  const rank = words.reduce<[string, number]>(
    (best, word) => {
      const calc = word
        .split('')
        .reduce((prev, letter) => prev + Number(relations.has(letter)), 0);
      const percent = calc / word.length;

      if (percent > best[1] && percent !== 1) {
        return [word, percent];
      } else {
        return best;
      }
    },
    ['', 0]
  );
  return rank[0];
};

export const wordToPattern = (word: string, relations: Map<string, string>) => {
  const letters: string[] = [];
  return word
    .split('')
    .map((letter, i, arr) => {
      if (arr.indexOf(letter) !== i && !letters.includes(letter)) {
        letters.push(letter);
      }
      return letter;
    })
    .map((letter) => {
      if (relations.has(letter)) return relations.get(letter);
      if (letters.includes(letter)) return letters.indexOf(letter);
      else return '.';
    })
    .join('');
};

export default function run() {
  // just because you dont understand it doesnt mean it isnt so
  const cryptogram =
    'vqhw muobqhu xjq pjfw qfpuehwbfp dw pjuhfw nubf dw dhfw hj';
  const relations = new Map<string, string>();
  const translate = () =>
    cryptogram
      .split('')
      .map((letter) =>
        relations.has(letter) ? c.green(relations.get(letter)!) : letter
      )
      .join('');

  let guesses: { target: string; guess: string }[] = [];
  const failed = new Map<string, string[]>();

  let iterations = 1000;
  let guess = '';
  let target = '';
  while (iterations > 0) {
    do {
      guess = target = '';
      if (guesses.length === 0) {
        target = getMostInfluentialWord(
          cryptogram.split(' '),
          getSmallestWords(cryptogram.split(' '))
        );
      } else {
        target = getMostFinishedWord(cryptogram.split(' '), relations);
      }

      const pattern = wordToPattern(target, relations);

      guess =
        filter(words, [...relations.keys()], pattern).find((word) =>
          [...failed].every((el) => !el[1].includes(word))
        ) ?? '';

      if (target && guess) {
        target
          .split('')
          .forEach((letter, i) => relations.set(letter, guess[i]));

        guesses.push({ target, guess });

        console.clear();
        console.log(translate());
        console.log('');
        console.log({ target, guess, pattern, failed, iterations, guesses });
      } else {
        console.log('no guess', { target, guess, pattern });
      }
    } while (guess?.length > 0);

    const last = guesses.pop();
    if (last) {
      const found = failed.get(last.target);
      if (!found) failed.set(last.target, [last.guess]);
      else failed.set(last.target, [...found, last.guess]);
      last.target.split('').forEach((letter) => relations.delete(letter));
    }

    iterations--;
  }

  console.log('out of loop');
}
