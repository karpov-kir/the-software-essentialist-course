export abstract class NumberAggregator {
  #value = 0;

  get value() {
    return this.#value;
  }

  protected set value(value: number) {
    this.#value = value;
  }

  protected abstract calculateNewAggregateValue(valueToProcess: number): number;

  process(valueToProcess: number) {
    this.#value = this.calculateNewAggregateValue(valueToProcess);
  }
}

export class MinValueAggregator extends NumberAggregator {
  constructor() {
    super();
    this.value = Infinity;
  }

  protected calculateNewAggregateValue(valueToProcess: number) {
    if (valueToProcess < this.value) {
      return valueToProcess;
    }

    return this.value;
  }
}

export class MaxValueAggregator extends NumberAggregator {
  constructor() {
    super();
    this.value = -Infinity;
  }

  protected calculateNewAggregateValue(valueToProcess: number) {
    if (valueToProcess > this.value) {
      return valueToProcess;
    }

    return this.value;
  }
}

export class AverageValueAggregator extends NumberAggregator {
  #numberOfElements = 0;
  #sum = 0;

  get numberOfElements() {
    return this.#numberOfElements;
  }

  protected calculateNewAggregateValue(valueToProcess: number) {
    this.#numberOfElements++;
    this.#sum += valueToProcess;

    return this.#sum / this.#numberOfElements;
  }
}
