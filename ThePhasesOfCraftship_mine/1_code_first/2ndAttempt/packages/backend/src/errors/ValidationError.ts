import { ServerErrorType, ValidationServerErrorDetailsDto } from "@dddforum/shared/dist/dtos/ServerErrorDto";
import { ZodError } from "zod";

import { ServerError } from "./ServerError";

export class ValidationError extends ServerError {
  public readonly details: ValidationServerErrorDetailsDto[];

  public static fromZodError(error: ZodError, message?: string): ValidationError {
    const details: ValidationServerErrorDetailsDto[] = [];

    error.issues.forEach((issue) => {
      details.push({
        path: issue.path,
        message: issue.message,
        type: issue.code,
      });
    });

    const validationError = new ValidationError({
      details,
      message,
    });

    validationError.stack = error.stack;

    return validationError;
  }

  constructor({
    details = [],
    message = "Validation error",
  }: { details?: ValidationServerErrorDetailsDto[]; message?: string } = {}) {
    super({
      message,
      type: ServerErrorType.ValidationError,
    });
    this.details = details;
  }
}
