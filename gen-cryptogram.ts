import { getMostInfluentialWord, getSmallestWords } from './crunch.ts';
import { scramble } from './lib.ts';

const sentence =
  'The manager of the fruit stand always sat and only sold vegetables.'.replace(
    /[^A-Za-z\s]/g,
    ''
  );

const cryptogram = scramble(sentence);
const words = cryptogram.split(' ');

console.log(cryptogram);
console.log(getMostInfluentialWord(words, getSmallestWords(words)));
