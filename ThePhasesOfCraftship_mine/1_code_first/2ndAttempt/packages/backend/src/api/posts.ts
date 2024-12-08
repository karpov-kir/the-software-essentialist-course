import { PostSort } from "@dddforum/shared/dist/dtos/PostDto";
import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { IsolationLevel } from "@mikro-orm/sqlite";
import { FastifyInstance } from "fastify";

import { getOrm } from "../db/getOrm";
import { fetchPostDetails } from "../db/views/postDetails";
import { fetchPostPreviews } from "../db/views/postPreview";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { getCurrentUserFromHeaders } from "../utils/auth";
import { removeVoteOnPost, voteOnPost } from "../utils/voting";

export const newPostsApi = async (fastify: FastifyInstance) => {
  const { orm } = await getOrm();

  fastify.get<{
    Querystring: { sort?: string };
  }>("/posts", async (request) => {
    const { sort } = request.query;
    const user = await getCurrentUserFromHeaders(request.headers, { includeMember: true });
    const posts = await fetchPostPreviews(orm.em, {
      currentMemberIdToIncludeVote: user?.member?.id,
      onlyNew: sort === PostSort.New,
      onlyPopular: sort === PostSort.Popular,
    });

    return posts;
  });

  fastify.get<{
    Params: { id: string };
  }>("/posts/:id", async (request) => {
    const user = await getCurrentUserFromHeaders(request.headers, { includeMember: true });
    const postId = parseInt(request.params.id);
    const post = await fetchPostDetails(orm.em, postId, {
      currentMemberIdToIncludeVote: user?.member?.id,
    });

    if (!post) {
      throw new NotFoundError();
    }

    return post;
  });

  fastify.post<{
    Params: { id: string };
  }>("/posts/:id/upvote", async (request) => {
    const user = await getCurrentUserFromHeaders(request.headers, { includeMember: true });
    const member = user?.member;

    if (!member) {
      throw new UnauthorizedError();
    }

    const postId = parseInt(request.params.id);

    await orm.em.transactional((em) => voteOnPost(postId, member.id, VoteType.Upvote, em), {
      isolationLevel: IsolationLevel.SERIALIZABLE,
    });
  });

  fastify.post<{
    Params: { id: string };
  }>("/posts/:id/downvote", async (request) => {
    const user = await getCurrentUserFromHeaders(request.headers, { includeMember: true });
    const member = user?.member;

    if (!member) {
      throw new UnauthorizedError();
    }

    const postId = parseInt(request.params.id);

    await orm.em.transactional((em) => voteOnPost(postId, member.id, VoteType.Downvote, em), {
      isolationLevel: IsolationLevel.SERIALIZABLE,
    });
  });

  fastify.delete<{
    Params: { id: string };
  }>("/posts/:id/vote", async (request) => {
    const user = await getCurrentUserFromHeaders(request.headers, { includeMember: true });
    const member = user?.member;

    if (!member) {
      throw new UnauthorizedError();
    }

    const postId = parseInt(request.params.id);

    await orm.em.transactional((em) => removeVoteOnPost(postId, member.id, em), {
      isolationLevel: IsolationLevel.SERIALIZABLE,
    });
  });
};
