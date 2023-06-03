import fp from "fastify-plugin";

async function authenticate(fastify, opts) {
  const { jwt } = fastify;

  fastify.decorate("authenticate", async (req, reply) => {
    try {
      // Check the presence of the "Authorization" header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw fastify.httpErrors.unauthorized("Missing Authorization header");
      }

      // Verify the JWT token
      const token = authHeader.replace("Bearer ", "");

      const decoded = jwt.verify(token, process.env.JWT);

      // Add the "user" object to the "req" object for use in subsequent routes
      req.user = decoded.username;
      (req.id = decoded.id), (req.role = decoded.role);
    } catch (error) {
    httpErrors.unauthorized("Invalid token");
    }
  });
}

export default fp(authenticate);
