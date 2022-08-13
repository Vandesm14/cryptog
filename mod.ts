#!/usr/bin/env -S rlwrap deno run --allow-all

import { filter, words } from './lib.ts';
import { __dirname } from './shared.ts';
import * as c from 'https://deno.land/std@0.152.0/fmt/colors.ts';

const exclude = new Set<string>();
let word = '';

console.log('Cryptogram Solver');
console.log('type "help" for a list of commands');

function runIfEq(value: string | null, map: Map<string | null, () => void>) {
  if (map.has(value)) {
    const fn = map.get(value);
    return fn ? fn() : null;
  } else {
    const fn = map.get(null);
    return fn ? fn() : null;
  }
}

while (true) {
  console.clear();
  console.log('Exclude:', c.yellow(Array.from(exclude).join('')));
  console.log('Word:', c.green(word));

  console.log('');

  word &&
    console.log(
      `Possible:\n${filter(words, Array.from(exclude), word)
        .map((word, i) => `${i + 1}: ${word}`)
        .slice(0, 10)
        .join('\n')}\n`
    );

  const input = prompt('>');
  const command = input?.split(' ')[0] ?? null;
  const args = input?.split(' ').slice(1).join(' ');

  const setWord = () => {
    if (args) {
      word = args;
    } else if (command) {
      // used as the default command
      word = command;
    }
  };

  const map = new Map<string | null, () => void>();
  map.set('exit', () => Deno.exit());
  map.set('exclude', () => {
    if (args) {
      if (args === '.') {
        exclude.clear();
      } else {
        args.split('').forEach((letter) => exclude.add(letter));
      }
    }
  });
  map.set('word', setWord);
  map.set('yes', () => {
    word.split('').forEach((letter) => exclude.add(letter));
    word = '';
  });
  map.set('clear', () => {
    word = '';
    exclude.clear();
  });
  map.set(null, setWord);

  runIfEq(command, map);
}
