import Fastify from "fastify";
import * as dotenv from "dotenv";
dotenv.config();

const fastify = Fastify({
  logger: true,
});

fastify.register(import("./app.js"));
const { port } = process.env;

const options = {
  port: port,
  host: '0.0.0.0'
};

fastify.listen(options, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});