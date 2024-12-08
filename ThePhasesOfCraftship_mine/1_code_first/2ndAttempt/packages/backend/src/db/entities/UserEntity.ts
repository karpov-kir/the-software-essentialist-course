import { Entity, OneToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core";

import { MemberEntity } from "./MemberEntity";

@Entity()
export class UserEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  firstName?: string;

  @Property()
  lastName?: string;

  @Property({ unique: true })
  email!: string;

  @Property({ unique: true })
  username!: string;

  @Property()
  password!: string;

  @OneToOne(() => MemberEntity, (member) => member.user, { owner: false })
  member?: Rel<MemberEntity>;

  @Property()
  createdAt = new Date();
}
