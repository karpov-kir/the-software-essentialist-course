import { Migrator } from "@mikro-orm/migrations";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { defineConfig } from "@mikro-orm/sqlite";
import path from "path";
import { fileURLToPath } from "url";

import { CommentEntity } from "./entities/CommentEntity";
import { MemberEntity } from "./entities/MemberEntity";
import { PostEntity } from "./entities/PostEntity";
import { UserEntity } from "./entities/UserEntity";
import { VoteEntity } from "./entities/VoteEntity";

const __filename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(__filename);

// no need to specify the `driver` now, it will be inferred automatically
export default defineConfig({
  dbName: path.join(currentDir, "./dev.db"),
  entities: [CommentEntity, MemberEntity, PostEntity, UserEntity, VoteEntity],
  // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
  // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
  metadataProvider: TsMorphMetadataProvider,
  highlighter: new SqlHighlighter(),
  // enable debug mode to log SQL queries and discovery information
  debug: true,
  extensions: [Migrator],
  migrations: {
    snapshot: false,
    path: path.join(currentDir, "./migrations"),
  },
  metadataCache: { pretty: true, options: { cacheDir: path.join(currentDir, "./cache") } },
});
