import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { EntityManager } from "@mikro-orm/sqlite";

import { CommentEntity } from "../db/CommentEntity";
import { MemberEntity } from "../db/MemberEntity";
import { PostEntity } from "../db/PostEntity";
import { VoteEntity } from "../db/VoteEntity";
import { NotFoundError } from "../errors/NotFoundError";

async function vote(entity: PostEntity | CommentEntity, memberId: number, voteType: VoteType, em: EntityManager) {
  const existingVote = await em.findOne(VoteEntity, {
    [entity instanceof PostEntity ? "post" : "comment"]: { id: entity.id },
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

    if (entity instanceof PostEntity) {
      vote.post = entity;
    } else {
      vote.comment = entity;
    }

    em.persist(vote);
  }
}

export async function voteOnPost(postId: number, memberId: number, voteType: VoteType, em: EntityManager) {
  const post = await em.findOne(PostEntity, { id: postId });

  if (!post) {
    throw new NotFoundError({
      message: `Post ${postId} not found`,
    });
  }

  await vote(post, memberId, voteType, em);
}

export async function voteOnComment(commentId: number, memberId: number, voteType: VoteType, em: EntityManager) {
  const comment = await em.findOne(CommentEntity, { id: commentId });

  if (!comment) {
    throw new NotFoundError({
      message: `Comment ${commentId} not found`,
    });
  }

  await vote(comment, memberId, voteType, em);
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
