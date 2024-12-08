import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { IsolationLevel } from "@mikro-orm/sqlite";
import { FastifyInstance } from "fastify";

import { getOrm } from "../db/getOrm";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { getCurrentUserFromHeaders } from "../utils/auth";
import { removeVoteOnComment, voteOnComment } from "../utils/voting";

export const newCommentsApi = async (fastify: FastifyInstance) => {
  const { orm } = await getOrm();

  fastify.post<{
    Params: { id: string };
  }>("/comments/:id/upvote", async (request) => {
    const user = await getCurrentUserFromHeaders(request.headers, { includeMember: true });
    const member = user?.member;

    if (!member) {
      throw new UnauthorizedError();
    }

    const commentId = parseInt(request.params.id);

    await orm.em.transactional((em) => voteOnComment(commentId, member.id, VoteType.Upvote, em));
  });

  fastify.post<{
    Params: { id: string };
  }>("/comments/:id/downvote", async (request) => {
    const user = await getCurrentUserFromHeaders(request.headers, { includeMember: true });
    const member = user?.member;

    if (!member) {
      throw new UnauthorizedError();
    }

    const commentId = parseInt(request.params.id);

    await orm.em.transactional((em) => voteOnComment(commentId, member.id, VoteType.Downvote, em));
  });

  fastify.delete<{
    Params: { id: string };
  }>("/comments/:id/vote", async (request) => {
    const user = await getCurrentUserFromHeaders(request.headers, { includeMember: true });
    const member = user?.member;

    if (!member) {
      throw new UnauthorizedError();
    }

    const commentId = parseInt(request.params.id);

    await orm.em.transactional((em) => removeVoteOnComment(commentId, member.id, em));
  });
};
