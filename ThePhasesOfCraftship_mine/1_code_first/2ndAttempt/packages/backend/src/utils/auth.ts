import jwt from "jsonwebtoken";

import { getOrm } from "../db/initOrm";
import { UserEntity } from "../db/UserEntity";

const jwtSecret = "very-very-sercet";

export const getCurrentUserFromHeaders = async (
  headers: Record<string, string | string[] | undefined>,
  {
    includeMember,
  }: {
    includeMember?: boolean;
  } = {},
): Promise<UserEntity | undefined> => {
  let authorizationHeader: string | undefined;

  if (Array.isArray(headers.authorization)) {
    authorizationHeader = headers.authorization[0];
  } else if (typeof headers.authorization === "string") {
    authorizationHeader = headers.authorization;
  }

  const accessToken = authorizationHeader?.replace("Bearer ", "");

  if (!accessToken) {
    return undefined;
  }

  let decoded: jwt.JwtPayload | string;

  try {
    decoded = jwt.verify(accessToken, jwtSecret);
  } catch {
    return undefined;
  }

  if (typeof decoded !== "object" || !decoded || !("email" in decoded)) {
    return undefined;
  }

  const { userRepository } = await getOrm();
  const user = await userRepository.findOne(
    { email: decoded.email },
    {
      populate: includeMember ? ["member"] : [],
    },
  );

  return user ?? undefined;
};

export const newAccessToken = (email: string) => jwt.sign({ email }, jwtSecret);
