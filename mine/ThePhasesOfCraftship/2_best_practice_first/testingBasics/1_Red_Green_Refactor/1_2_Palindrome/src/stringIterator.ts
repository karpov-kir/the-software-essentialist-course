export type StringIteratorValue = {
  position: number;
  character: string;
};

type StringIteratorOptions = {
  reverse?: boolean;
};

export const createStringIterator = (
  value: string,
  { reverse }: StringIteratorOptions = {},
): Iterator<StringIteratorValue> => {
  let currentPosition = 0;

  if (!value) {
    throw new Error('Value must not be empty');
  }

  return {
    next() {
      const directionRespectfulPosition = reverse ? value.length - currentPosition - 1 : currentPosition;
      const character = value[directionRespectfulPosition];
      const isLast = currentPosition >= value.length - 1;
      const iteratorValue: StringIteratorValue = {
        character,
        position: directionRespectfulPosition,
      };

      if (isLast) {
        return {
          value: iteratorValue,
          done: true,
        };
      }

      currentPosition++;

      return {
        value: iteratorValue,
        done: false,
      };
    },
  };
};
