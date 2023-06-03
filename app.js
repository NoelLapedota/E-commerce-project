import { join, dirname } from "path";
import { fileURLToPath } from "url";
import AutoLoad from "@fastify/autoload";
import Sensible from "@fastify/sensible";
import Multipart from "@fastify/multipart";
import Jwt from "@fastify/jwt";
import fastifyStatic from "@fastify/static";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default async function app(fastify, opts) {
  fastify.register(fastifyStatic, {
    root: join(__dirname),
  });
  fastify.register(Jwt, { secret: process.env.JWT });
  fastify.register(Sensible);
  fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
  });

  fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
  });

  fastify.register(AutoLoad, {
    dir: join(__dirname, "models"),
  });

  fastify.register(Multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });
 
}
