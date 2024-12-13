import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { EntityManager } from "@mikro-orm/sqlite";

import { CommentEntity } from "../db/entities/CommentEntity";
import { MemberEntity } from "../db/entities/MemberEntity";
import { PostEntity } from "../db/entities/PostEntity";
import { VoteEntity } from "../db/entities/VoteEntity";
import { NotFoundError } from "../errors/NotFoundError";

export async function voteOnPost(postId: number, memberId: number, voteType: VoteType, em: EntityManager) {
  const post = await em.findOne(PostEntity, { id: postId });

  if (!post) {
    throw new NotFoundError({
      message: `Post ${postId} not found`,
    });
  }

  const existingVote = await em.findOne(VoteEntity, {
    post: { id: post.id },
    comment: {
      id: null,
    },
    member: { id: memberId },
  });

  if (existingVote) {
    if (existingVote.type !== voteType) {
      existingVote.type = voteType;
      em.persist(existingVote);
    }
  } else {
    const vote = new VoteEntity();
    vote.type = voteType;
    vote.member = em.getReference(MemberEntity, memberId);
    vote.post = post;

    em.persist(vote);
  }

  await em.flush();
}

export async function voteOnComment(commentId: number, memberId: number, voteType: VoteType, em: EntityManager) {
  const comment = await em.findOne(CommentEntity, { id: commentId });

  if (!comment) {
    throw new NotFoundError({
      message: `Comment ${commentId} not found`,
    });
  }

  const existingVote = await em.findOne(VoteEntity, {
    comment: { id: comment.id },
    member: { id: memberId },
  });

  if (existingVote) {
    if (existingVote.type !== voteType) {
      existingVote.type = voteType;
      em.persist(existingVote);
    }
  } else {
    const vote = new VoteEntity();
    vote.type = voteType;
    vote.member = em.getReference(MemberEntity, memberId);
    vote.comment = comment;
    vote.post = comment.post;

    em.persist(vote);
  }

  await em.flush();
}

async function removeVote(entity: PostEntity | CommentEntity, memberId: number, em: EntityManager) {
  await em.nativeDelete(VoteEntity, {
    [entity instanceof PostEntity ? "post" : "comment"]: { id: entity.id },
    member: { id: memberId },
  });
}

export async function removeVoteOnPost(postId: number, memberId: number, em: EntityManager) {
  const post = await em.findOne(PostEntity, { id: postId });

  if (!post) {
    throw new NotFoundError({
      message: `Post ${postId} not found`,
    });
  }

  await removeVote(post, memberId, em);
}

export async function removeVoteOnComment(commentId: number, memberId: number, em: EntityManager) {
  const comment = await em.findOne(CommentEntity, { id: commentId });

  if (!comment) {
    throw new NotFoundError({
      message: `Comment ${commentId} not found`,
    });
  }

  await removeVote(comment, memberId, em);
}
