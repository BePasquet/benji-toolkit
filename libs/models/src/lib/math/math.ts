export function mean(set: number[]): number {
  const sum = set.reduce((acu, num) => acu + num, 0);
  const count = set.length;
  const result = sum / count;

  return result;
}

export function median(set: number[]): number {
  if (!set.length) {
    return 0;
  }

  const sortedXs = [...set].sort((a, b) => a - b);
  const isEven = sortedXs.length % 2 === 0;

  // floor is to compute the correct index based on zero index arrays
  const half = Math.floor(sortedXs.length / 2);

  const median = isEven
    ? mean([sortedXs[half - 1], sortedXs[half]])
    : sortedXs[half];

  return median;
}

export interface MedianData {
  min: number;
  max: number;
  q1: number;
  q3: number;
  median: number;
  iqr: number;
  outliers: number[];
}

export function medianData(set: number[]): MedianData | null {
  if (!set.length) {
    return null;
  }

  const sortedXs = set.sort((a, b) => a - b);

  const length = sortedXs.length;

  const min = sortedXs[0];
  const max = sortedXs[length - 1];

  // floor is to compute the correct index based on zero index arrays
  const half = Math.floor(length / 2);

  const q1 = median(sortedXs.slice(0, half));
  const m = median(sortedXs);
  const q3 = median(sortedXs.slice(half));
  // interquartile range
  const iqr = q3 - q1;
  const bottomOutlierThreshold = q1 - iqr * 1.5;
  const topOutlierThreshold = q3 + iqr * 1.5;

  const outliers = sortedXs.reduce(
    (state, value, index) =>
      value < bottomOutlierThreshold || value > topOutlierThreshold
        ? [...state, index]
        : state,
    [] as number[]
  );

  return {
    min,
    max,
    q1,
    q3,
    median: m,
    iqr,
    outliers,
  };
}

export type SetType = 'population' | 'sample';

export interface VarianceParams {
  set: number[];
  type?: SetType;
}

export function variance({ set, type = 'population' }: VarianceParams): number {
  const aMean = mean(set);

  const sum = set.reduce((result, element) => {
    const deviation = element - aMean;
    const squaredDeviation = Math.pow(deviation, 2);
    return result + squaredDeviation;
  }, 0);

  const count = type === 'population' ? set.length : set.length - 1;
  const result = sum / count;

  return result;
}

export interface StandardDeviationParams {
  set: number[];
  type?: SetType;
}

export function standardDeviation({
  set,
  type = 'population',
}: StandardDeviationParams): number {
  const v = variance({ set, type });
  const result = Math.sqrt(v);

  return result;
}
