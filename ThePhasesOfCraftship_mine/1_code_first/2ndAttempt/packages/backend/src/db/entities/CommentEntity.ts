import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Rel } from "@mikro-orm/core";

import { MemberEntity } from "./MemberEntity";
import { PostEntity } from "./PostEntity";
import { VoteEntity } from "./VoteEntity";

@Entity()
export class CommentEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  content!: string;

  @ManyToOne(() => MemberEntity)
  member!: Rel<MemberEntity>;

  @ManyToOne(() => PostEntity)
  post!: Rel<PostEntity>;

  @OneToMany(() => VoteEntity, (vote) => vote.comment)
  votes = new Collection<VoteEntity>(this);

  @Property()
  createdAt = new Date();
}
