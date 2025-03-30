import { ServerError, ServerException } from './errors';

export type ServerErrorResponseDto = {
  type: string;
  success: false;
  message?: string;
  statusCode: number;
};

export type ServerSuccessResponseDto<T> = {
  data: T;
  success: true;
  message?: string;
};

export type ServerResponseDto<T> = ServerErrorResponseDto | ServerSuccessResponseDto<T>;

export function newServerErrorResponseDto(errorOrException: ServerError | ServerException): ServerErrorResponseDto {
  return {
    type: errorOrException.type,
    success: false,
    message: errorOrException.message,
    statusCode: errorOrException.statusCode,
  };
}

export function newServerSuccessResponseDto<T>({
  data,
  message,
}: {
  data: T;
  message?: string;
}): ServerSuccessResponseDto<T> {
  return {
    data,
    message,
    success: true,
  };
}
