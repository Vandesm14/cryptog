import { getMostInfluentialWord, getSmallestWords } from './crunch.ts';
import { filter, scramble, words } from './lib.ts';

const sentence =
  'The manager of the fruit stand always sat and only sold vegetables.'.replace(
    /[^A-Za-z\s]/g,
    ''
  );

const cryptogram = scramble(sentence);

console.log(cryptogram);
const firstWord = getMostInfluentialWord(
  cryptogram.split(' '),
  getSmallestWords(cryptogram.split(' '))
);

const guess = filter(words, [], '.'.repeat(firstWord.length))[0];
