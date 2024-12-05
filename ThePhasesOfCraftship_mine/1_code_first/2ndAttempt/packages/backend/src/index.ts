import cors from "@fastify/cors";
import { RequestContext } from "@mikro-orm/core";
import Fastify from "fastify";

import { newCommentsApi } from "./api/comments";
import { newPostsApi } from "./api/posts";
import { newUsersApi } from "./api/users";
import { getOrm, initOrm } from "./db/initOrm";
import { seed } from "./db/seed";
import { errorHandler } from "./errors/errorHandler";

await initOrm();
await seed();

const fastify = Fastify({
  logger: {
    transport: {
      // TODO use only in development, use structured logging in production
      target: "pino-pretty",
    },
  },
});

fastify.setErrorHandler(errorHandler);

await fastify.register(cors, {});

const { orm } = await getOrm();

fastify.addHook("onRequest", (request, reply, done) => {
  RequestContext.create(orm.em, done);
});

fastify.addHook("onClose", async () => {
  await orm.close();
});

fastify.get("/", async (request, reply) => {
  reply.send("OK");
});

await newPostsApi(fastify);
await newUsersApi(fastify);
await newCommentsApi(fastify);

// Run the server!
fastify.listen({ port: 3000 }, (err, _address) => {
  if (err) throw err;
});
