abstract class NumberAggregator {
  #value = 0;

  get value() {
    return this.#value;
  }

  protected set value(value: number) {
    this.#value = value;
  }

  protected abstract calculateNewAggregateValue(valueToApply: number): number;

  aggregate(newValue: number) {
    this.#value = this.calculateNewAggregateValue(newValue);
  }
}

export class MinValueAggregator extends NumberAggregator {
  constructor() {
    super();
    this.value = Infinity;
  }

  protected calculateNewAggregateValue(valueToApply: number) {
    if (valueToApply < this.value) {
      return valueToApply;
    }

    return this.value;
  }
}

export class MaxValueAggregator extends NumberAggregator {
  constructor() {
    super();
    this.value = -Infinity;
  }

  protected calculateNewAggregateValue(valueToApply: number) {
    if (valueToApply > this.value) {
      return valueToApply;
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

  get value() {
    return this.#sum / this.#numberOfElements;
  }

  protected calculateNewAggregateValue(valueToApply: number) {
    this.#numberOfElements++;
    this.#sum += valueToApply;

    return this.value;
  }
}
