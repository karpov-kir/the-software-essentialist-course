export class StatsCalculator {
  calculate(sequence: number[]) {
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
    };
  }
}
