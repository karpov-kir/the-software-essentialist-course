export interface AccessTokenDto {
  accessToken: string;
}

export enum SignUpServerErrorReason {
  UserAlreadyExists = "userAlreadyExists",
}

export interface SignUpDto {
  firstName?: string;
  lastName?: string;
  email: string;
  username: string;
  password: string;
}

export enum SignInServerErrorReason {
  InvalidPassword = "invalidPassword",
  UserNotFound = "userNotFound",
}

export interface SignInDto {
  username: string;
  password: string;
}

export interface UserDto {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  username: string;
}
