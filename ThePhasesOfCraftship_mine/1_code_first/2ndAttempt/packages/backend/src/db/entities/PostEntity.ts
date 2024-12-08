import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Rel } from "@mikro-orm/core";

import { CommentEntity } from "./CommentEntity";
import { MemberEntity } from "./MemberEntity";
import { VoteEntity } from "./VoteEntity";

@Entity()
export class PostEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property()
  content!: string;

  @ManyToOne(() => MemberEntity)
  member!: Rel<MemberEntity>;

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments = new Collection<CommentEntity>(this);

  @OneToMany(() => VoteEntity, (vote) => vote.post)
  votes = new Collection<VoteEntity>(this);

  @Property()
  createdAt = new Date();
}
