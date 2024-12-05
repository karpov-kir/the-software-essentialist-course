import { Migration } from "@mikro-orm/migrations";

export class Migration_2024_11_20_initial extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table \`user_entity\` (\`id\` integer not null primary key autoincrement, \`first_name\` text null, \`last_name\` text null, \`email\` text not null, \`username\` text not null, \`password\` text not null, \`member_id\` integer null, \`created_at\` date not null, constraint \`user_entity_member_id_foreign\` foreign key(\`member_id\`) references \`member_entity\`(\`id\`) on delete set null on update cascade);`,
    );
    this.addSql(`create unique index \`user_entity_email_unique\` on \`user_entity\` (\`email\`);`);
    this.addSql(`create unique index \`user_entity_member_id_unique\` on \`user_entity\` (\`member_id\`);`);

    this.addSql(
      `create table \`member_entity\` (\`id\` integer not null primary key autoincrement, \`user_id\` integer not null, \`created_at\` date not null, constraint \`member_entity_user_id_foreign\` foreign key(\`user_id\`) references \`user_entity\`(\`id\`) on update cascade);`,
    );
    this.addSql(`create unique index \`member_entity_user_id_unique\` on \`member_entity\` (\`user_id\`);`);

    this.addSql(
      `create table \`post_entity\` (\`id\` integer not null primary key autoincrement, \`title\` text not null, \`content\` text not null, \`member_id\` integer not null, \`created_at\` date not null, constraint \`post_entity_member_id_foreign\` foreign key(\`member_id\`) references \`member_entity\`(\`id\`) on update cascade);`,
    );
    this.addSql(`create index \`post_entity_member_id_index\` on \`post_entity\` (\`member_id\`);`);

    this.addSql(
      `create table \`comment_entity\` (\`id\` integer not null primary key autoincrement, \`content\` text not null, \`member_id\` integer not null, \`post_id\` integer not null, \`created_at\` date not null, constraint \`comment_entity_member_id_foreign\` foreign key(\`member_id\`) references \`member_entity\`(\`id\`) on update cascade, constraint \`comment_entity_post_id_foreign\` foreign key(\`post_id\`) references \`post_entity\`(\`id\`) on update cascade);`,
    );
    this.addSql(`create index \`comment_entity_member_id_index\` on \`comment_entity\` (\`member_id\`);`);
    this.addSql(`create index \`comment_entity_post_id_index\` on \`comment_entity\` (\`post_id\`);`);

    this.addSql(
      `create table \`vote_entity\` (\`id\` integer not null primary key autoincrement, \`type\` VoteType not null, \`member_id\` integer not null, \`post_id\` integer null, \`comment_id\` integer null, \`created_at\` date not null, constraint \`vote_entity_member_id_foreign\` foreign key(\`member_id\`) references \`member_entity\`(\`id\`) on update cascade, constraint \`vote_entity_post_id_foreign\` foreign key(\`post_id\`) references \`post_entity\`(\`id\`) on delete set null on update cascade, constraint \`vote_entity_comment_id_foreign\` foreign key(\`comment_id\`) references \`comment_entity\`(\`id\`) on delete set null on update cascade);`,
    );
    this.addSql(`create index \`vote_entity_member_id_index\` on \`vote_entity\` (\`member_id\`);`);
    this.addSql(`create index \`vote_entity_post_id_index\` on \`vote_entity\` (\`post_id\`);`);
    this.addSql(`create index \`vote_entity_comment_id_index\` on \`vote_entity\` (\`comment_id\`);`);
  }
}
