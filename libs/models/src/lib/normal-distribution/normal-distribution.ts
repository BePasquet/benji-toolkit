import { mean, standardDeviation } from '../math/math';

export interface NormalDistributionPDFParams {
  value: number;
  mean: number;
  sd: number;
}

export function normalDistributionPDF({
  value,
  mean,
  sd,
}: NormalDistributionPDFParams): number {
  const dividend = Math.pow(Math.E, -0.5 * Math.pow((value - mean) / sd, 2));
  const divisor = sd * Math.sqrt(2 * Math.PI);
  const result = dividend / divisor;

  return result;
}

export function ndPredict(events: number[], value: number): number {
  const m = mean(events);
  const sd = standardDeviation({ set: events });
  const result = normalDistributionPDF({ value, mean: m, sd });

  return result;
}

export interface NormalDistribution {
  mean: number;
  points: [number, number][];
}

export function normalDistribution(events: number[]): NormalDistribution {
  const m = mean(events);
  const sd = standardDeviation({ set: events });

  const points = Array(3)
    .fill(null)
    .map((_, i) => {
      const deviation = sd * (i + 1);

      const up = m + deviation;

      const down = m - deviation;

      return [up, down] as [number, number];
    });

  return { mean: m, points };
}
