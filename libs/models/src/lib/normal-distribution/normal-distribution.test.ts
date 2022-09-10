import { normalDistributionPDF } from './normal-distribution';

describe('Normal Distribution', () => {
  describe('normalDistributionPDF', () => {
    it('should return 0.3989422804014327 for x = 0 on a standard normal distribution', () => {
      const result = normalDistributionPDF({ value: 0, mean: 0, sd: 1 });
      expect(result).toBe(0.3989422804014327);
    });

    it('should return 0.00013383022576488545 for a z-score of -4', () => {
      const result = normalDistributionPDF({ value: -4, mean: 0, sd: 1 });
      const expected = 0.00013383022576488545;
      expect(result).toBe(expected);
    });

    it('should return 0.00013383022576488542 for a z-score of 4', () => {
      const result = normalDistributionPDF({ value: 4, mean: 0, sd: 1 });
      const expected = 0.00013383022576488545;
      expect(result).toBe(expected);
    });
  });
});
