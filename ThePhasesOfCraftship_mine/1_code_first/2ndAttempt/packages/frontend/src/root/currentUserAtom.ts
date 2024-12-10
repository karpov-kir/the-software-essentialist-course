import { UserDto } from "@dddforum/shared/dist/dtos/UserDto";
import { atom } from "jotai";

export const currentUserAtom = atom<UserDto | undefined>();
