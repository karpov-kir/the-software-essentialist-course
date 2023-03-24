const allowedBooleanTokens = ['TRUE', 'FALSE'];
const allowedLogicTokens = ['AND', 'OR'];
const allowedTokens = [...allowedBooleanTokens, ...allowedLogicTokens];

enum ParsingState {
  ExpectingBoolean,
  ExpectingLogic,
}

export class BooleanCalculator {
  isTruthy(booleanExpression: string) {
    const tokens = booleanExpression.split(' ');

    tokens.forEach((token) => {
      if (!allowedTokens.includes(token)) {
        throw new Error(`Unexpected token "${token}"`);
      }
    });

    let parsingState = ParsingState.ExpectingBoolean;
    let state: boolean | undefined;
    let logic: string | undefined;

    tokens.forEach((token) => {
      if (parsingState === ParsingState.ExpectingBoolean) {
        if (!allowedBooleanTokens.includes(token)) {
          throw new Error(`Expect a boolean token but go "${token}"`);
        }

        if (state === undefined) {
          state = token === 'TRUE';
        } else {
          if (logic === 'AND') {
            state = state && token === 'TRUE';
          } else {
            state = state || token === 'TRUE';
          }
        }

        parsingState = ParsingState.ExpectingLogic;
      } else if (parsingState === ParsingState.ExpectingLogic) {
        if (!allowedLogicTokens.includes(token)) {
          throw new Error(`Expect a logic token but go "${token}"`);
        }

        logic = token;
        parsingState = ParsingState.ExpectingBoolean;
      }
    });

    return state;
  }
}
