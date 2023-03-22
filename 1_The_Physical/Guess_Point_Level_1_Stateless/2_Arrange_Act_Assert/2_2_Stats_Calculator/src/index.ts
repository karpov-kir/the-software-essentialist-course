interface Stats {
  min: number;
  max: number;
  numberOfElements: number;
}

export class StatsCalculator {
  calculate(sequence: number[]): Stats {
    let min = Infinity;
    let max = -Infinity;

    sequence.forEach((value) => {
      if (value < min) {
        min = value;
      }

      if (value > max) {
        max = value;
      }
    });

    return {
      min,
      max,
      numberOfElements: sequence.length,
    };
  }
}
