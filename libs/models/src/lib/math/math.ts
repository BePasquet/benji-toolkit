import { UnaryFunction } from 'rxjs';

export function mean(set: number[]): number {
  const sum = set.reduce((state, element) => state + element, 0);
  const result = sum / set.length;

  return result;
}

export function median(set: number[]): number {
  if (!set.length) {
    return 0;
  }

  const sortedSet = [...set].sort((a, b) => a - b);
  const isEven = sortedSet.length % 2 === 0;

  // floor is to compute the correct index based on zero index arrays
  const half = Math.floor(sortedSet.length / 2);

  const median = isEven
    ? mean([sortedSet[half - 1], sortedSet[half]])
    : sortedSet[half];

  return median;
}

export interface OutlierData {
  index: number;
  value: number;
}

export interface MedianData {
  min: number;
  max: number;
  q1: number;
  q3: number;
  median: number;
  iqr: number;
  outliers: OutlierData[];
}

export function medianData(set: number[]): MedianData | null {
  if (!set.length) {
    return null;
  }

  const sortedSet = set.sort((a, b) => a - b);

  const length = sortedSet.length;

  const min = sortedSet[0];
  const max = sortedSet[length - 1];

  // floor is to compute the correct index based on zero index arrays
  const half = Math.floor(length / 2);

  const q1 = median(sortedSet.slice(0, half));
  const m = median(sortedSet);
  const q3 = median(sortedSet.slice(half));
  // interquartile range
  const iqr = q3 - q1;
  const bottomOutlierThreshold = q1 - iqr * 1.5;
  const topOutlierThreshold = q3 + iqr * 1.5;

  const outliers = sortedSet.reduce(
    (state, element, index) =>
      element < bottomOutlierThreshold || element > topOutlierThreshold
        ? [...state, { index, value: element }]
        : state,
    [] as OutlierData[]
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

  const sum = set.reduce((state, element) => {
    const deviation = element - aMean;
    const squaredDeviation = Math.pow(deviation, 2);

    return state + squaredDeviation;
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

export function meanAbsoluteDeviation(set: number[]): number {
  const aMean = mean(set);

  const sum = set.reduce(
    (state, element) => state + Math.abs(element - aMean),
    0
  );

  const result = sum / set.length;

  return result;
}

export function range(set: number[]): number {
  const min = Math.min(...set);
  const max = Math.max(...set);
  const result = max - min;

  return result;
}

export function midRange(set: number[]): number {
  const min = Math.min(...set);
  const max = Math.max(...set);
  const result = mean([min, max]);

  return result;
}

export interface PercentileParams {
  set: number[];
  element: number;
  type?: 'bellow' | 'included';
}

export function percentile({
  element,
  set,
  type = 'bellow',
}: PercentileParams): number | null {
  if (!set.length) {
    return null;
  }

  const index = set.indexOf(element);

  // Element doesn't exist
  if (index < 0) {
    return null;
  }

  // Increments zero indexation
  const offset = type === 'included' ? 1 : 0;

  const result = (index + offset) / set.length;

  return result;
}

export interface ZScoreParams {
  element: number;
  mean: number;
  standardDeviation: number;
}

export function zScore(params: ZScoreParams): number | null {
  // Can't divide by zero
  if (params.standardDeviation <= 0) {
    return null;
  }

  const result = (params.element - params.mean) / params.standardDeviation;

  return result;
}

export interface CorrelationCoefficientParams {
  set: [number, number][];
  xMean: number;
  yMean: number;
  sx: number;
  sy: number;
}

export function correlationCoefficient({
  set,
  xMean,
  yMean,
  sx,
  sy,
}: CorrelationCoefficientParams): number {
  const sum = set.reduce((state, [x, y]) => {
    const xScore =
      zScore({ element: x, mean: xMean, standardDeviation: sx }) ?? 0;
    const yScore =
      zScore({ element: y, mean: yMean, standardDeviation: sy }) ?? 0;

    const score = xScore * yScore;

    return state + score;
  }, 0);

  const count = set.length - 1;

  const result = sum / count;

  return result;
}

export function createLSR(
  set: [number, number][]
): UnaryFunction<number, number> {
  const xs = set.map(([x]) => x);
  const ys = set.map(([, y]) => y);

  const xMean = mean(xs);
  const yMean = mean(ys);

  const sx = standardDeviation({ set: xs, type: 'sample' });
  const sy = standardDeviation({ set: ys, type: 'sample' });

  const r = correlationCoefficient({ set, xMean, yMean, sx, sy });

  const m = r * (sy / sx);
  const b = yMean - m * xMean;

  return (x: number) => m * x + b;
}
