import S from "fluent-json-schema";
import connection from "../db/db.js";
import bcrypt from "bcryptjs";

export default async function login(fastify, opts) {
  const { httpErrors, jwt } = fastify;

  fastify.route({
    method: "POST",
    path: "/login",
    schema: {
      body: S.object()
        .prop("username", S.string().required())
        .prop("password", S.string().minLength(7).required())
        .additionalProperties(false),
    },
    handler: onLogin,
  });

  // Handler function for the login route
  async function onLogin(req, reply) {
    const { username, password } = req.body;

    try {
      // Retrieve the user from the database
      const user = await connection("accounts")
        .select("username", "password", "role", "id")
        .where("username", username)
        .first();
      // Check if the user exists or if the password is incorrect
      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw httpErrors.unauthorized(401, "Bad username or password");
      } else {
        // Generate a JWT token for the authenticated user
        const token = jwt.sign(
          {
            id: user.id,
            role: user.role,
            username: user.username,
          },
          process.env.JWT,
          { expiresIn: "5h" }
        );
        console.log(token);

        // Set the response code to 201 (Created) and return the token
        reply.header("Authorization", `Bearer ${token}`).send({ token });
      }
    } catch (error) {
      // Handle errors
      console.error("Error during login:", error);
      throw error;
    }
  }
}
