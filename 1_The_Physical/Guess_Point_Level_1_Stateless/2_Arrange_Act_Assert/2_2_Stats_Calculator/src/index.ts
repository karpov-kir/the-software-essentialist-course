interface Stats {
  min: number;
  max: number;
  numberOfElements: number;
  average: number;
}

type NonEmptySequence = [number, ...number[]];

export class StatsCalculator {
  calculate(sequence: NonEmptySequence): Stats {
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;

    sequence.forEach((value) => {
      if (value < min) {
        min = value;
      }

      if (value > max) {
        max = value;
      }

      sum += value;
    });

    return {
      min,
      max,
      numberOfElements: sequence.length,
      average: sum / sequence.length,
    };
  }
}
