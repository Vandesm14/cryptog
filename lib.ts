export const __dirname = new URL('.', import.meta.url).pathname;

const p = Deno.run({ cmd: ['pwd'] });
await p.status();
export const pwd = p.stdout ?? __dirname;

const getWords = (path: string): string[] => {
  const text = Deno.readTextFileSync(path);
  const lines = text
    .split(/\r?\n/g)
    .slice(1)
    .map((line) => line.split(',')[0]);

  return lines;
};

const getAllIndexes = (string: string, char: string): number[] =>
  string
    .split('')
    .map((letter, i) => (letter === char ? i : null))
    .filter((el) => el !== null) as number[];

export const filter = (words: string[], exclude: string[], pattern: string) =>
  words.filter(
    (word) =>
      new RegExp(pattern.replace(/[0-9]/g, '.')).test(word) &&
      word.length === pattern.length &&
      exclude.every(
        (letter) =>
          word.indexOf(letter) === -1 ||
          pattern.indexOf(letter) === word.indexOf(letter)
      ) &&
      Array.from(new Set(pattern.match(/[0-9]/g))).every((number) => {
        const indexes = getAllIndexes(pattern, number);
        const letters = new Set(indexes.map((index) => word[index]));
        return letters.size === 1;
      })
  );

export const words = getWords(`${__dirname}/unigram_freq.csv`);

export const inc = <K>(map: Map<K, number>, key: K) => {
  if (map.has(key)) map.set(key, map.get(key)! + 1);
  else map.set(key, 1);
};
