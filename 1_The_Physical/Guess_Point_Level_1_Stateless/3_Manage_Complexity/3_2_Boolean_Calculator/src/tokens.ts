export const booleanTokens = ['TRUE', 'FALSE'];
export const logicTokens = ['AND', 'OR'];
export const negationToken = 'NOT';
export const openGroupToken = '(';
export const closeGroupToken = ')';

export enum Logic {
  And = 'AND',
  Or = 'OR',
}

export enum TokenType {
  Boolean = 'Boolean',
  // AND, OR
  Logic = 'Logic',
  Negation = 'Not',
  OpenGroup = 'OpenGroup',
  CloseGroup = 'CloseGroup',
  Unknown = 'Unknown',
}
