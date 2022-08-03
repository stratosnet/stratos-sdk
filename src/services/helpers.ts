export const now = () => new Date().toLocaleString();

export const log = (message: string, ...rest: any) => {
  console.log(
    `"${now()}" - ${message}`,
    (Array.isArray(rest) && rest.length) || Object.keys(rest).length ? rest : '',
  );
};

export async function wait(fn: any, ms: number) {
  while (!fn()) {
    await delay(ms);
  }
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
