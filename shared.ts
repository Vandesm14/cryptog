export const __dirname = new URL('.', import.meta.url).pathname;

const p = Deno.run({ cmd: ['pwd'] });
await p.status();
export const pwd = p.stdout ?? __dirname;
