import { ServerErrorType } from "@dddforum/shared/dist/dtos/ServerErrorDto";

import { ServerError } from "./ServerError";

export class UnauthorizedError extends ServerError {
  constructor({
    message = "Unauthorized",
    reason,
  }: {
    message?: string;
    reason?: string;
  } = {}) {
    super({
      message,
      type: ServerErrorType.UnauthorizedError,
      reason,
    });
  }
}
