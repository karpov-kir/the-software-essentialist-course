export enum ServerErrorType {
  ValidationError = "validationError",
  InternalError = "internalError",
  UnauthorizedError = "unauthorizedError",
  NotFoundError = "notFoundError",
}

export interface ServerErrorDto {
  message: string;
  type: ServerErrorType;
  reason?: string;
}

export interface ValidationServerErrorDetailsDto {
  path: Array<string | number>;
  message: string;
  type: string;
}

export interface ValidationServerErrorDto extends ServerErrorDto {
  type: ServerErrorType.ValidationError;
  details: ValidationServerErrorDetailsDto[];
}

export const isServerErrorDto = (error: unknown): error is ServerErrorDto => {
  return Boolean(
    error &&
      typeof error === "object" &&
      "type" in error &&
      typeof error.type === "string" &&
      Object.values<string>(ServerErrorType).includes(error.type),
  );
};
