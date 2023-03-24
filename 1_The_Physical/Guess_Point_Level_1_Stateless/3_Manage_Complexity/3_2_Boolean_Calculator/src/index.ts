const allowedTokens = ['TRUE', 'FALSE', 'AND'];

export class BooleanCalculator {
  isTruthy(booleanExpression: string) {
    const tokens = booleanExpression.split(' ');

    tokens.forEach((token) => {
      if (!allowedTokens.includes(token)) {
        throw new Error(`Unexpected token "${token}"`);
      }
    });

    return booleanExpression === 'TRUE';
  }
}
