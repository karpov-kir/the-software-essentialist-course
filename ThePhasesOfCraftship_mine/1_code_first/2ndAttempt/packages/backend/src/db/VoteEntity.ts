import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { Entity, ManyToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core";

import { CommentEntity } from "./CommentEntity";
import { MemberEntity } from "./MemberEntity";
import { PostEntity } from "./PostEntity";

@Entity()
export class VoteEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  type!: VoteType;

  @ManyToOne(() => MemberEntity)
  member!: Rel<MemberEntity>;

  @ManyToOne(() => PostEntity)
  post?: Rel<PostEntity>;

  @ManyToOne(() => CommentEntity)
  comment?: Rel<CommentEntity>;

  @Property()
  createdAt = new Date();
}
