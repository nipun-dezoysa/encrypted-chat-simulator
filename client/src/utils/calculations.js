export const baseNum = 7;
export const modulusNum = 23;

export function calCompuvate(exponent) {
  if (modulusNum === 1) return 0;
  let result = 1;
  let currentBase = baseNum % modulusNum;

  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * currentBase) % modulusNum;
    }
    exponent = Math.floor(exponent / 2);
    currentBase = (currentBase * currentBase) % modulusNum;
  }

  return result;
}

export function calKey(exponent, computes) {
  if (modulusNum === 1) return 0;
  let result = 1;
  let currentBase = computes % modulusNum;

  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * currentBase) % modulusNum;
    }
    exponent = Math.floor(exponent / 2);
    currentBase = (currentBase * currentBase) % modulusNum;
  }

  return result;
}
