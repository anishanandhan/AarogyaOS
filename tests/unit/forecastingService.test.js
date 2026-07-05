import { describe, it, expect } from 'vitest';
import { calculateForecast } from '../../backend/src/services/forecastingService';

describe('Least Squares Linear Regression Math Solver - calculateForecast()', () => {

  // --- GROUP 1: HAPPY PATHS & DOMAIN TRENDS ---
  describe('Happy Path & Trend Calculations', () => {
    it('1. should calculate an ascending slope for a positive growth trend', () => {
      const data = [
        { day: 1, value: 10 },
        { day: 2, value: 20 },
        { day: 3, value: 30 }
      ];
      const result = calculateForecast(data, 3);
      expect(result.slope).toBeGreaterThan(0);
      expect(result.intercept).toBeCloseTo(0);
      expect(result.predictions).toHaveLength(3);
      expect(result.predictions[0].forecast_value).toBe(40);
    });

    it('2. should calculate a descending slope for a negative growth trend', () => {
      const data = [
        { day: 1, value: 50 },
        { day: 2, value: 40 },
        { day: 3, value: 30 }
      ];
      const result = calculateForecast(data, 1);
      expect(result.slope).toBeLessThan(0);
      expect(result.predictions[0].forecast_value).toBe(20);
    });

    it('3. should calculate zero slope for flat static values', () => {
      const data = [
        { day: 1, value: 100 },
        { day: 2, value: 100 },
        { day: 3, value: 100 }
      ];
      const result = calculateForecast(data, 2);
      expect(result.slope).toBe(0);
      expect(result.intercept).toBe(100);
      expect(result.predictions[0].forecast_value).toBe(100);
    });

    it('4. should correctly project forecast days to the requested size', () => {
      const data = [
        { day: 1, value: 10 },
        { day: 2, value: 20 }
      ];
      const result = calculateForecast(data, 14);
      expect(result.predictions).toHaveLength(14);
    });

    it('5. should start day indexes incrementally from n + 1', () => {
      const data = [
        { day: 1, value: 5 },
        { day: 2, value: 10 },
        { day: 3, value: 15 }
      ];
      const result = calculateForecast(data, 3);
      expect(result.predictions[0].day).toBe(4);
      expect(result.predictions[1].day).toBe(5);
      expect(result.predictions[2].day).toBe(6);
    });
  });

  // --- GROUP 2: DEFAULT BASELINE HANDLERS ---
  describe('Input Array Fallbacks', () => {
    it('6. should fall back to default baseline if historicalData is null', () => {
      const result = calculateForecast(null);
      expect(result.predictions).toHaveLength(7);
      expect(result.predictions[0].day).toBe(8);
    });

    it('7. should fall back to default baseline if historicalData is undefined', () => {
      const result = calculateForecast(undefined);
      expect(result.predictions).toHaveLength(7);
    });

    it('8. should fall back to default baseline if historicalData is empty', () => {
      const result = calculateForecast([]);
      expect(result.predictions).toHaveLength(7);
    });

    it('9. should fall back to default baseline if historicalData has only 1 data point', () => {
      const result = calculateForecast([{ day: 1, value: 50 }]);
      expect(result.predictions).toHaveLength(7);
    });
  });

  // --- GROUP 3: BOUNDARY & CLAMPING CONTROLS ---
  describe('Boundary & Clamping Controls', () => {
    it('10. should clamp predicted values to 0 if the slope leads to negative projections', () => {
      const data = [
        { day: 1, value: 10 },
        { day: 2, value: 1 }
      ];
      const result = calculateForecast(data, 5);
      result.predictions.forEach(p => {
        expect(p.forecast_value).toBeGreaterThanOrEqual(0);
        expect(p.lower_bound).toBeGreaterThanOrEqual(0);
      });
    });

    it('11. should clamp lower bounds to 0 while keeping upper bounds positive', () => {
      const data = [
        { day: 1, value: 50 },
        { day: 2, value: 10 },
        { day: 3, value: 80 }
      ];
      const result = calculateForecast(data, 2);
      expect(result.predictions[0].lower_bound).toBe(0);
      expect(result.predictions[0].upper_bound).toBeGreaterThan(0);
    });

    it('12. should handle zeros safely as historical values', () => {
      const data = [
        { day: 1, value: 0 },
        { day: 2, value: 0 },
        { day: 3, value: 0 }
      ];
      const result = calculateForecast(data, 1);
      expect(result.predictions[0].forecast_value).toBe(0);
    });

    it('13. should handle large inputs without numerical overflow or infinity errors', () => {
      const data = [
        { day: 1, value: 1000000 },
        { day: 2, value: 2000000 }
      ];
      const result = calculateForecast(data, 2);
      expect(result.predictions[0].forecast_value).toBe(3000000);
    });
  });

  // --- GROUP 4: MISSING OR MALFORMED KEYS ---
  describe('Missing Keys & Index Fallbacks', () => {
    it('14. should fall back to index-based days if day key is missing', () => {
      const data = [
        { value: 10 },
        { value: 20 },
        { value: 30 }
      ];
      const result = calculateForecast(data, 1);
      expect(result.slope).toBe(10);
      expect(result.predictions[0].day).toBe(4);
    });

    it('15. should handle zero-based day values correctly', () => {
      const data = [
        { day: 0, value: 10 },
        { day: 1, value: 20 }
      ];
      const result = calculateForecast(data, 1);
      expect(result.predictions[0].day).toBe(3);
    });
  });

  // --- GROUP 5: STANDARD ERROR & CONFIDENCE MARGINS ---
  describe('Standard Error & Variance Bounds', () => {
    it('16. should compute zero standard error for perfectly collinear datasets', () => {
      const data = [
        { day: 1, value: 10 },
        { day: 2, value: 20 },
        { day: 3, value: 30 }
      ];
      const result = calculateForecast(data, 1);
      expect(result.standardError).toBe(0);
    });

    it('17. should compute positive standard error for high-variance data', () => {
      const data = [
        { day: 1, value: 10 },
        { day: 2, value: 90 },
        { day: 3, value: 15 }
      ];
      const result = calculateForecast(data, 1);
      expect(result.standardError).toBeGreaterThan(0);
    });

    it('18. should default standard error to 5 for small datasets of exactly 2 items', () => {
      const data = [
        { day: 1, value: 10 },
        { day: 2, value: 20 }
      ];
      const result = calculateForecast(data, 1);
      expect(result.standardError).toBe(5);
    });

    it('19. should increase confidence bounds as standard error grows', () => {
      const lowVar = [
        { day: 1, value: 10 },
        { day: 2, value: 11 },
        { day: 3, value: 12 }
      ];
      const highVar = [
        { day: 1, value: 10 },
        { day: 2, value: 80 },
        { day: 3, value: 12 }
      ];
      const resLow = calculateForecast(lowVar, 1);
      const resHigh = calculateForecast(highVar, 1);
      expect(resHigh.standardError).toBeGreaterThan(resLow.standardError);
    });
  });

  // --- GROUP 6: EDGE CASES & SAFETY GUARDS ---
  describe('Division by Zero & Extremes', () => {
    it('20. should prevent division by zero when all days are identical (denominator is zero)', () => {
      const data = [
        { day: 5, value: 10 },
        { day: 5, value: 20 }
      ];
      const result = calculateForecast(data, 1);
      expect(result.slope).toBe(0);
      expect(result.intercept).toBe(15);
    });

    it('21. should handle NaN values gracefully by returning numerical defaults or safe fallbacks', () => {
      const data = [
        { day: 1, value: NaN },
        { day: 2, value: 20 }
      ];
      const result = calculateForecast(data, 1);
      expect(result.predictions).toBeDefined();
    });

    it('22. should handle null values inside the input data values safely', () => {
      const data = [
        { day: 1, value: null },
        { day: 2, value: 20 }
      ];
      const result = calculateForecast(data, 1);
      expect(result.predictions).toBeDefined();
    });

    it('23. should handle negative day values cleanly', () => {
      const data = [
        { day: -2, value: 10 },
        { day: -1, value: 20 }
      ];
      const result = calculateForecast(data, 1);
      expect(result.predictions[0].day).toBe(3);
    });

    it('24. should compute standard bounds correct mathematical spacing', () => {
      const data = [
        { day: 1, value: 10 },
        { day: 2, value: 12 },
        { day: 3, value: 11 },
        { day: 4, value: 15 }
      ];
      const result = calculateForecast(data, 1);
      const margin = 1.96 * result.standardError;
      const expectedLower = Math.max(0, Math.round(result.predictions[0].forecast_value - margin));
      expect(result.predictions[0].lower_bound).toBe(expectedLower);
    });

    it('25. should handle float values for day keys safely', () => {
      const data = [
        { day: 1.5, value: 10 },
        { day: 2.5, value: 20 }
      ];
      const result = calculateForecast(data, 1);
      expect(result.predictions).toHaveLength(1);
    });
  });
});
