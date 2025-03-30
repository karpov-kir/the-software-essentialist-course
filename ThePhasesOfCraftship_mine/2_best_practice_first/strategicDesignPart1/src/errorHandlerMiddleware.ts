import { NextFunction, Request, Response } from 'express';

import { ServerError, ServerException } from './shared/errors';
import { newServerErrorResponseDto } from './shared/serverResponseDto';

export function errorHandlerMiddleware(errorOrException: unknown, req: Request, res: Response, _next: NextFunction) {
  if (errorOrException instanceof ServerError || errorOrException instanceof ServerException) {
    res.status(errorOrException.statusCode).json(newServerErrorResponseDto(errorOrException));
    return;
  }

  // Do not expose the details to the client because it might contain sensitive information.
  // We should log the error instead.
  console.error('Internal error', errorOrException);

  const internalServerError = new ServerError({
    type: 'internal-server-error',
    statusCode: 500,
    message: 'Internal server error',
  });

  res.status(internalServerError.statusCode).json(newServerErrorResponseDto(internalServerError));
}
