import { Collection, Entity, OneToMany, OneToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core";

import { CommentEntity } from "./CommentEntity";
import { PostEntity } from "./PostEntity";
import { UserEntity } from "./UserEntity";
import { VoteEntity } from "./VoteEntity";

@Entity()
export class MemberEntity {
  @PrimaryKey()
  id!: number;

  @OneToMany(() => VoteEntity, (vote) => vote.member)
  votes = new Collection<VoteEntity>(this);

  @OneToMany(() => CommentEntity, (comment) => comment.member)
  comments = new Collection<CommentEntity>(this);

  @OneToMany(() => PostEntity, (post) => post.member)
  posts = new Collection<PostEntity>(this);

  @OneToOne(() => UserEntity, (user) => user.member, { owner: true })
  user!: Rel<UserEntity>;

  @Property()
  createdAt = new Date();
}
