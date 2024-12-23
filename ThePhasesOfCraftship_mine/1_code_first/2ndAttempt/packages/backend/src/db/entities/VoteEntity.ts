import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";
import { Entity, ManyToOne, PrimaryKey, Property, Rel, Unique } from "@mikro-orm/core";

import { CommentEntity } from "./CommentEntity";
import { MemberEntity } from "./MemberEntity";
import { PostEntity } from "./PostEntity";

@Entity()
@Unique({
  expression: "create index `vote_entity_id_post_id_comment_id_unique` on vote_entity (`id`, `post_id`, `comment_id`)",
})
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
