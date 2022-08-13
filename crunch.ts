import { filter, inc, words } from './lib.ts';
import * as c from 'https://deno.land/std@0.152.0/fmt/colors.ts';

export const getSmallestWord = (words: string[]) => {
  const sorted = words.sort((a, b) => a.length - b.length);
  const smallest = sorted.filter((word) => word.length === sorted[0].length);

  if (smallest.length > 1) {
    const letters = new Map<string, number>();
    words.forEach((word) =>
      word.split('').forEach((letter) => inc(letters, letter))
    );
    // find one with letters used most in the gram
    const rank = smallest.reduce(
      (best, word) => {
        const calc = word
          .split('')
          .reduce((prev, letter) => prev + (letters.get(letter) ?? 1), 0);

        if (calc > best[1]) {
          return [word, calc];
        } else {
          return best;
        }
      },
      ['', 0]
    );
    return rank[0] as string;
  } else {
    return sorted[0];
  }
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

const cryptogram = 'vqhw muobqhu xjq pjfw qfpuehwbfp dw pjuhfw nubf dw dhfw hj';
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
      target = getSmallestWord(cryptogram.split(' '));
    } else {
      target = getMostFinishedWord(cryptogram.split(' '), relations);
    }

    const pattern = target
      .split('')
      .map((letter) => relations.get(letter) ?? '.')
      .join('');

    guess =
      filter(words, [...relations.keys()], pattern).find((word) =>
        [...failed].every((el) => !el[1].includes(word))
      ) ?? '';

    if (target && guess) {
      target.split('').forEach((letter, i) => relations.set(letter, guess[i]));

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
