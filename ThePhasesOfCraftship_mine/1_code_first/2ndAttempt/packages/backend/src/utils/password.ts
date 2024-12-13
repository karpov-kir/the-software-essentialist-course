import bcrypt from "bcrypt";

const passwordSaltRounds = 10;

export const isPasswordValid = (plainPassword: string, encryptedPassword: string) => {
  return bcrypt.compare(plainPassword, encryptedPassword);
};

export const encryptPassword = (plainPassword: string) => {
  return bcrypt.hash(plainPassword, passwordSaltRounds);
};
