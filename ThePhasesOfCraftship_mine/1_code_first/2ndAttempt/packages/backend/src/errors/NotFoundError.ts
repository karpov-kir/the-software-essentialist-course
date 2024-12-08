import { ServerErrorDto, ServerErrorType } from "@dddforum/shared/dist/dtos/ServerErrorDto";

import { ServerError } from "./ServerError";

export class NotFoundError extends ServerError implements ServerErrorDto {
  public readonly type = ServerErrorType.NotFoundError;

  constructor({
    message = "Not found",
  }: {
    message?: string;
  } = {}) {
    super({
      message,
      type: ServerErrorType.NotFoundError,
    });
  }
}
