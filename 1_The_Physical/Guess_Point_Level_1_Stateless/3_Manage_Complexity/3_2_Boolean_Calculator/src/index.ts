const allowedBooleanTokens = ['TRUE', 'FALSE'];
const allowedLogicTokens = ['AND', 'OR', 'NOT'];
const negationToken = 'NOT';
const allowedTokens = [...allowedBooleanTokens, ...allowedLogicTokens, negationToken];

enum ParsingState {
  ExpectingBoolean,
  ExpectingLogic,
  ExpectingNegation,
}

export class BooleanCalculator {
  isTruthy(booleanExpression: string) {
    const tokens = booleanExpression.split(' ');

    tokens.forEach((token) => {
      if (!allowedTokens.includes(token)) {
        throw new Error(`Unexpected token "${token}"`);
      }
    });

    let parsingState = [ParsingState.ExpectingBoolean, ParsingState.ExpectingNegation];
    let state: boolean | undefined;
    let logic: string | undefined;
    let isNegated = false;

    tokens.forEach((token) => {
      if (
        parsingState.includes(ParsingState.ExpectingBoolean) &&
        parsingState.includes(ParsingState.ExpectingNegation)
      ) {
        const isBooleanToken = allowedBooleanTokens.includes(token);
        const isNegationToken = token === negationToken;

        if (!isBooleanToken && !isNegationToken) {
          throw new Error(`Expect a boolean or negation token but got "${token}"`);
        }

        if (isBooleanToken) {
          let tokenState = token === 'TRUE';

          if (isNegated) {
            tokenState = !tokenState;
            isNegated = false;
          }

          if (state === undefined) {
            state = tokenState;
          } else {
            if (logic === 'AND') {
              state = state && tokenState;
            } else {
              state = state || tokenState;
            }
          }

          parsingState = [ParsingState.ExpectingLogic];
        } else {
          parsingState = [ParsingState.ExpectingBoolean];
          isNegated = true;
        }
      } else if (parsingState.includes(ParsingState.ExpectingBoolean)) {
        const isBooleanToken = allowedBooleanTokens.includes(token);

        if (!isBooleanToken) {
          throw new Error(`Expect a boolean token but got "${token}"`);
        }

        let tokenState = token === 'TRUE';

        if (isNegated) {
          tokenState = !tokenState;
          isNegated = false;
        }

        if (state === undefined) {
          state = tokenState;
        } else {
          if (logic === 'AND') {
            state = state && tokenState;
          } else {
            state = state || tokenState;
          }
        }

        parsingState = [ParsingState.ExpectingLogic];
      } else if (parsingState.includes(ParsingState.ExpectingLogic)) {
        const isLogicToken = allowedLogicTokens.includes(token);

        if (!isLogicToken) {
          throw new Error(`Expect a logic token but got "${token}"`);
        }

        logic = token;
        parsingState = [ParsingState.ExpectingBoolean, ParsingState.ExpectingNegation];
      }
    });

    return state;
  }
}
