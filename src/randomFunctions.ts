export function randomSample<T>(arr: T[], n?: number) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
}

export function randomChoice<T>(arr: T[]) {
  return [...arr].sort(() => 0.5 - Math.random())[0];
}
