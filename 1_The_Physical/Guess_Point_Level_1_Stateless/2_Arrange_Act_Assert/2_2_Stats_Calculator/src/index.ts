export class StatsCalculator {
  calculate(sequence: number[]) {
    let min = Infinity;

    sequence.forEach((value) => {
      if (value < min) {
        min = value;
      }
    });

    return {
      min,
    };
  }
}
