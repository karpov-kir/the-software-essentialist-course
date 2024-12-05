import { CommentDto } from "@dddforum/shared/dist/dtos/CommentDto";
import { MemberDto } from "@dddforum/shared/dist/dtos/MemberDto";
import { PostDetailsDto, PostPreviewDto } from "@dddforum/shared/dist/dtos/PostDto";
import { UserDto } from "@dddforum/shared/dist/dtos/UserDto";
import { VoteDto } from "@dddforum/shared/dist/dtos/VoteDto";

import { CommentEntity } from "../db/CommentEntity";
import { MemberEntity } from "../db/MemberEntity";
import { PostEntity } from "../db/PostEntity";
import { UserEntity } from "../db/UserEntity";

export const toUserDto = (userEntity: UserEntity): UserDto => {
  return {
    id: userEntity.id,
    username: userEntity.username,
    email: userEntity.email,
    firstName: userEntity.firstName,
    lastName: userEntity.lastName,
  };
};

export const toMemberDto = (memberEntity: MemberEntity): MemberDto => {
  return {
    id: memberEntity.id,
    user: toUserDto(memberEntity.user),
  };
};

export const toCommentDto = (commentEntity: CommentEntity, member?: MemberEntity): CommentDto => {
  return {
    id: commentEntity.id,
    content: commentEntity.content,
    member: toMemberDto(commentEntity.member),
    votes: commentEntity.votes.map((vote) => ({
      id: vote.id,
      type: vote.type,
    })),
    createdAt: commentEntity.createdAt.toISOString(),
    currentMemberVoteType: member ? commentEntity.votes.find((vote) => vote.member.id === member.id)?.type : undefined,
  };
};

export const toPostDetailsDto = (postEntity: PostEntity, member?: MemberEntity): PostDetailsDto => {
  return {
    id: postEntity.id,
    title: postEntity.title,
    content: postEntity.content,
    member: toMemberDto(postEntity.member),
    votes: postEntity.votes.map((vote) => ({
      id: vote.id,
      type: vote.type,
    })),
    createdAt: postEntity.createdAt.toISOString(),
    comments: postEntity.comments.map((comment) => toCommentDto(comment, member)),
    currentMemberVoteType: member ? postEntity.votes.find((vote) => vote.member.id === member.id)?.type : undefined,
  };
};

export const toPostPreviewDto = (postEntity: PostEntity, member?: MemberEntity): PostPreviewDto => {
  return {
    id: postEntity.id,
    title: postEntity.title,
    content: postEntity.content,
    member: toMemberDto(postEntity.member),
    votes: postEntity.votes.map((vote) => ({
      id: vote.id,
      type: vote.type,
    })),
    votesFromComments: postEntity.comments.reduce<VoteDto[]>((votesFromComments, comment) => {
      return [...votesFromComments, ...comment.votes];
    }, []),
    commentCount: postEntity.comments.length,
    createdAt: postEntity.createdAt.toISOString(),
    currentMemberVoteType: member ? postEntity.votes.find((vote) => vote.member.id === member.id)?.type : undefined,
  };
};
