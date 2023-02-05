export const roundNumberTo2Decimals = (num: number): number =>
  Math.round((num + Number.EPSILON) * 100) / 100;
