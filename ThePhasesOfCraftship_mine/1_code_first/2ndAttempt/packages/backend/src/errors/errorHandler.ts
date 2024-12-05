import {
  isServerErrorDto,
  ServerErrorDto,
  ServerErrorType,
  ValidationServerErrorDto,
} from "@dddforum/shared/dist/dtos/ServerErrorDto";
import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

import { ValidationError } from "./ValidationError";

const errorToStatusCode = new Map<ServerErrorType, number>([
  [ServerErrorType.ValidationError, 400],
  [ServerErrorType.UnauthorizedError, 401],
  [ServerErrorType.NotFoundError, 404],
  [ServerErrorType.InternalError, 500],
]);

export function errorHandler(
  this: FastifyInstance,
  rawError: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  let error: Error = rawError;

  if (rawError instanceof ZodError) {
    error = ValidationError.fromZodError(rawError);
  }

  this.log.error(error);

  let type: ServerErrorType;
  if (isServerErrorDto(error)) {
    type = error.type;
  } else {
    type = ServerErrorType.InternalError;
    this.log.error(error);
  }

  const statusCode = errorToStatusCode.get(type) ?? 500;

  reply.status(statusCode);

  return reply.send(formatError(error));
}

function formatError(error: Error): ServerErrorDto | ValidationServerErrorDto {
  if (!isServerErrorDto(error)) {
    return {
      message: "Internal server error",
      type: ServerErrorType.InternalError,
    };
  }

  const serverErrorDto: ServerErrorDto = {
    message: error.message,
    type: error.type,
    reason: error.reason,
  };

  if (error instanceof ValidationError) {
    return {
      ...serverErrorDto,
      details: error.details,
    };
  }

  return serverErrorDto;
}
