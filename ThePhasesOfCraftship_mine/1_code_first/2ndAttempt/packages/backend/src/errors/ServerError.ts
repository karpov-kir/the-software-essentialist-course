import { ServerErrorDto, ServerErrorType } from "@dddforum/shared/dist/dtos/ServerErrorDto";

export class ServerError extends Error implements ServerErrorDto {
  public readonly type: ServerErrorType;
  public readonly reason?: string;

  constructor({ message, type, reason }: { message: string; type: ServerErrorType; reason?: string }) {
    super(message);

    this.type = type;
    this.reason = reason;
  }
}
