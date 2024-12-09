import {
  AccessTokenDto,
  SignInDto,
  SignInServerErrorReason,
  SignUpDto,
  SignUpServerErrorReason,
} from "@dddforum/shared/dist/dtos/UserDto";
import { signUpDtoSchema } from "@dddforum/shared/dist/validationSchemas/signUpDtoSchema";
import { FastifyInstance } from "fastify";

import { toUserDto } from "../db/entities/toDtos";
import { getOrm } from "../db/getOrm";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { getCurrentUserFromHeaders, newAccessToken } from "../utils/auth";
import { encryptPassword, isPasswordValid } from "../utils/password";

export const newUsersApi = async (fastify: FastifyInstance) => {
  const { userRepository, memberRepository, orm } = await getOrm();

  fastify.get("/users/me", async (request) => {
    const user = await getCurrentUserFromHeaders(request.headers);

    if (!user) {
      throw new UnauthorizedError();
    }

    return toUserDto(user);
  });

  fastify.post<{
    Body: SignInDto;
  }>("/users/sign-in", async (request) => {
    const { username, password } = request.body;

    const user = await userRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedError({
        reason: SignInServerErrorReason.UserNotFound,
      });
    }

    if (!(await isPasswordValid(password, user.password))) {
      throw new UnauthorizedError({
        reason: SignInServerErrorReason.InvalidPassword,
      });
    }

    const accessTokenDto: AccessTokenDto = { accessToken: newAccessToken(user.email) };

    return accessTokenDto;
  });

  fastify.post<{
    Body: SignUpDto;
  }>("/users/sign-up", async (request) => {
    const signUpDto = signUpDtoSchema.parse(request.body);

    const user = userRepository.create({
      ...signUpDto,
      password: await encryptPassword(signUpDto.password),
      createdAt: new Date(),
    });
    memberRepository.create({ user, createdAt: new Date() });

    try {
      await orm.em.flush();
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new UnauthorizedError({
          reason: SignUpServerErrorReason.UserAlreadyExists,
        });
      }

      throw error;
    }

    const accessTokenDto: AccessTokenDto = { accessToken: newAccessToken(user.email) };

    return accessTokenDto;
  });
};

const isUniqueConstraintError = (error: unknown) => {
  return error && typeof error === "object" && "name" in error && error.name === "UniqueConstraintViolationException";
};
