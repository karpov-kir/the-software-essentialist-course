export class ServerError extends Error {
  public readonly type: string;
  public readonly statusCode: number;

  constructor({
    type,
    statusCode,
    message,
  }: {
    type: string;
    statusCode: number;
    message: string;
    details?: Record<string, unknown>;
  }) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
  }
}

export class ServerException extends ServerError {}

export class ValidationException extends ServerException {
  constructor({ message }: { message: string }) {
    super({ type: 'validation-error', statusCode: 400, message });
  }
}
