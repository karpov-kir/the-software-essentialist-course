import { UserDto } from "@dddforum/shared/dist/dtos/UserDto";

import { UserEntity } from "./UserEntity";

export const toUserDto = (userEntity: UserEntity): UserDto => {
  // Exclude password
  const { password: _password, ...rest } = userEntity;
  return rest;
};
