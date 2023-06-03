import fs from "fs";

export default async function hello(fastify, opts) {
  fastify.route({
    method: "GET",
    path: "/",
    handler: onHome,
  });

  async function onHome(req, reply) {
    const stream = fs.createReadStream("./index.html");
    reply.type("text/html").send(stream);
    return reply;
  }
}
