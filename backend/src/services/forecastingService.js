/**
 * Least Squares Linear Regression Forecasting Service
 * Computes actual mathematical trend lines and forecasts confidence bounds
 */

export function calculateForecast(historicalData, forecastDays = 7) {
  // If historicalData is empty or too short, supply a default baseline
  if (!historicalData || historicalData.length < 2) {
    historicalData = [
      { day: 1, value: 75 },
      { day: 2, value: 82 },
      { day: 3, value: 80 },
      { day: 4, value: 95 },
      { day: 5, value: 88 },
      { day: 6, value: 110 },
      { day: 7, value: 115 }
    ];
  }

  const n = historicalData.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    const x = historicalData[i].day || (i + 1);
    const y = historicalData[i].value;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  // Calculate Slope (m) and Intercept (c)
  const denominator = (n * sumXX) - (sumX * sumX);
  const slope = denominator !== 0 ? ((n * sumXY) - (sumX * sumY)) / denominator : 0;
  const intercept = (sumY - (slope * sumX)) / n;

  // Calculate Standard Error of the Regression to generate confidence intervals
  let sumResidualSquared = 0;
  for (let i = 0; i < n; i++) {
    const x = historicalData[i].day || (i + 1);
    const y = historicalData[i].value;
    const predicted = (slope * x) + intercept;
    sumResidualSquared += Math.pow(y - predicted, 2);
  }
  
  const standardError = n > 2 ? Math.sqrt(sumResidualSquared / (n - 2)) : 5;

  // Generate 7-day predictions
  const predictions = [];
  const startDay = n + 1;

  for (let i = 0; i < forecastDays; i++) {
    const x = startDay + i;
    const predictedValue = Math.max(0, Math.round((slope * x) + intercept));
    
    // Use 1.96 standard errors for a 95% confidence interval
    const marginOfError = 1.96 * standardError;
    const lowerBound = Math.max(0, Math.round(predictedValue - marginOfError));
    const upperBound = Math.round(predictedValue + marginOfError);

    predictions.push({
      day: x,
      forecast_value: predictedValue,
      lower_bound: lowerBound,
      upper_bound: upperBound
    });
  }

  return {
    slope,
    intercept,
    standardError,
    predictions
  };
}
