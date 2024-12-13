import { EntityManager, EntityRepository, MikroORM, Options } from "@mikro-orm/sqlite";

import defaultMicroOrmConfig from "./config";
import { CommentEntity } from "./entities/CommentEntity";
import { MemberEntity } from "./entities/MemberEntity";
import { PostEntity } from "./entities/PostEntity";
import { UserEntity } from "./entities/UserEntity";
import { VoteEntity } from "./entities/VoteEntity";

export interface OrmServices {
  orm: MikroORM;
  forkEm: () => EntityManager;
  postRepository: EntityRepository<PostEntity>;
  userRepository: EntityRepository<UserEntity>;
  commentsRepository: EntityRepository<CommentEntity>;
  voteRepository: EntityRepository<VoteEntity>;
  memberRepository: EntityRepository<MemberEntity>;
}

let cache: OrmServices;

export async function initOrm(config: Options = defaultMicroOrmConfig) {
  if (cache) {
    throw new Error("ORM already initialized");
  }

  const orm = await MikroORM.init(config);

  cache = {
    orm,
    forkEm: () => orm.em.fork(),
    postRepository: orm.em.getRepository(PostEntity),
    userRepository: orm.em.getRepository(UserEntity),
    commentsRepository: orm.em.getRepository(CommentEntity),
    voteRepository: orm.em.getRepository(VoteEntity),
    memberRepository: orm.em.getRepository(MemberEntity),
  };
}

export async function getOrm(): Promise<OrmServices> {
  if (cache) {
    return cache;
  }

  throw new Error("ORM not initialized");
}
