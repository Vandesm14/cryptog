#!/usr/bin/env -S rlwrap deno run --allow-all

import { filter, words, __dirname } from './lib.ts';
import * as c from 'https://deno.land/std@0.152.0/fmt/colors.ts';

let state = {
  exclude: new Set<string>(),
  word: '',
  cryptogram: '',
  choices: [] as string[],
};
const history: Array<typeof state> = [structuredClone(state)];

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
  console.log('Exclude:', c.yellow(Array.from(state.exclude).join('')));
  console.log('Word:', c.green(state.word));

  console.log('');

  state.choices = filter(words, Array.from(state.exclude), state.word);

  state.word &&
    console.log(
      `Possible (${state.choices.length}):\n${state.choices
        .map((word, i) => `${i + 1}: ${word}`)
        .slice(0, 10)
        .join('\n')}\n`
    );

  const input = prompt('>');
  const command = input?.split(' ')[0] ?? null;
  const args = input?.split(' ').slice(1).join(' ');

  const setWord = () => {
    if (args) {
      state.word = args;
    } else if (command) {
      // used as the default command
      state.word = command;
    }
  };

  const map = new Map<string | null, () => void>();
  map.set('exit', () => Deno.exit());
  map.set('exclude', () => {
    if (args) {
      if (args === '.') {
        state.exclude.clear();
      } else {
        args.split('').forEach((letter) => state.exclude.add(letter));
      }
    }
  });
  map.set('word', setWord);
  map.set('clear', () => {
    if (command) {
      state.exclude.clear();
      state.word = command;
    }
  });
  map.set('undo', () => {
    if (history.length > 0) {
      // pop the current state
      history.pop();
      // pop the previous state (since this is now the current, it will get saved at the end of the WHILE loop)
      state = structuredClone(history.pop());
    }
  });
  map.set(null, () => {
    // if only numbers
    if (
      command &&
      command.length <= 2 &&
      command.replace(/[0-9]/g, '').length === 0
    ) {
      state.choices[Number(command) - 1]
        .split('')
        .forEach((letter) => state.exclude.add(letter));
    } else {
      setWord();
    }
  });

  runIfEq(command, map);
  history.push(structuredClone(state));
}
