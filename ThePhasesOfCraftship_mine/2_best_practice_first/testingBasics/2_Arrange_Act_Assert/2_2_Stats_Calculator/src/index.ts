import { AverageValueAggregator, MaxValueAggregator, MinValueAggregator } from './NumberAggregator';

interface Stats {
  min: number;
  max: number;
  numberOfElements: number;
  average: number;
}

export type NonEmptySequence = [number, ...number[]];

export class StatsCalculator {
  calculate(sequence: NonEmptySequence): Stats {
    const aggregators = [new MinValueAggregator(), new MaxValueAggregator(), new AverageValueAggregator()] as const;

    sequence.forEach((value) => {
      aggregators.forEach((aggregator) => {
        aggregator.process(value);
      });
    });

    const [{ value: min }, { value: max }, { value: average, numberOfElements }] = aggregators;

    return {
      min,
      max,
      numberOfElements,
      average,
    };
  }
}
