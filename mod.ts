#!/usr/bin/env -S rlwrap deno run --allow-all

import { filter, words } from './lib.ts';
import { __dirname } from './shared.ts';
import * as c from 'https://deno.land/std@0.152.0/fmt/colors.ts';

const exclude: string[] = [];
let word = '';

let exit = false;

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

while (!exit) {
  console.clear();
  console.log('Exclude:', c.yellow(exclude.join('')));
  console.log('Word:', c.green(word));

  console.log('');

  word &&
    console.log(
      `Possible:\n${filter(words, exclude, word)
        .map((word, i) => `${i + 1}: ${word}`)
        .slice(0, 10)
        .join('\n')}`
    );

  console.log('');

  const input = prompt('>');
  const command = input?.split(' ')[0] ?? null;
  const args = input?.split(' ').slice(1).join(' ');

  const map = new Map<string, () => void>();
  map.set('exit', () => Deno.exit());
  map.set('exclude', () => {
    if (args) {
      exclude.push(...args.split(''));
    }
  });
  map.set('word', () => {
    if (args) {
      word = args;
    }
  });

  runIfEq(command, map);
}
