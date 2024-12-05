import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { IsolationLevel, raw } from "@mikro-orm/sqlite";
import { FastifyInstance } from "fastify";

import { CommentEntity } from "../db/CommentEntity";
import { getOrm } from "../db/initOrm";
import { PostEntity } from "../db/PostEntity";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { getCurrentUserFromHeaders } from "../utils/auth";
import { toPostDetailsDto, toPostPreviewDto } from "../utils/toDtos";
import { removeVoteOnPost, voteOnPost } from "../utils/voting";

export const newPostsApi = async (fastify: FastifyInstance) => {
  const { postRepository, orm, forkEm } = await getOrm();

  fastify.get<{
    Querystring: { sort?: string };
  }>("/posts", async (request) => {
    const { sort } = request.query;
    const user = await getCurrentUserFromHeaders(request.headers, { includeMember: true });

    let posts: PostEntity[];

    // Popular posts with 4 or more comments
    if (sort === "popular") {
      const em = forkEm();
      const knex = em.getKnex();
      const commentCountQueryBuilder = em
        .createQueryBuilder(CommentEntity)
        .count("id")
        .where({ post: knex.ref("p.id") });

      const postsQueryBuilder = em
        .createQueryBuilder(PostEntity, "p")
        .select(["*", raw(`(${commentCountQueryBuilder.getKnexQuery()}) as commentCount`)])
        .leftJoinAndSelect("p.member", "m")
        .leftJoinAndSelect("m.user", "mu")
        .leftJoinAndSelect("p.comments", "c")
        .leftJoinAndSelect("c.votes", "cv")
        .leftJoinAndSelect("p.votes", "v")
        .where(raw("commentCount >= 4"))
        .orderBy({ "p.createdAt": "DESC" });
      posts = await postsQueryBuilder.getResultList();
    }
    // Posts from the last two weeks
    else if (sort === "new") {
      const twoWeeksMs = 1000 * 60 * 60 * 24 * 14;
      posts = await postRepository.find(
        {
          createdAt: { $gte: new Date(Date.now() - twoWeeksMs) },
        },
        {
          populate: ["member", "member.user", "comments", "comments.votes", "votes"],
          orderBy: { createdAt: "DESC" },
        },
      );
    }
    // All posts by default
    else {
      posts = await postRepository.find(
        {},
        {
          populate: ["member", "member.user", "comments", "comments.votes", "votes"],
          orderBy: { createdAt: "DESC" },
        },
      );
    }

    return posts.map((post) => toPostPreviewDto(post, user?.member));
  });

  fastify.get<{
    Params: { id: string };
  }>("/posts/:id", async (request) => {
    const user = await getCurrentUserFromHeaders(request.headers, { includeMember: true });
    const postId = parseInt(request.params.id);
    const post = await postRepository.findOne(
      {
        id: postId,
      },
      {
        populate: [
          "member",
          "member.user",
          "comments",
          "comments.votes",
          "comments.member",
          "comments.member.user",
          "votes",
        ],
      },
    );

    if (!post) {
      throw new NotFoundError();
    }

    return toPostDetailsDto(post, user?.member);
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
