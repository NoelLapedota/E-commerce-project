import S from "fluent-json-schema";
import connection from "../db/db.js";
import bcrypt from "bcryptjs";

export default async function shopping(fastify, opts) {
  const { httpErrors } = fastify;

  fastify.route({
    method: "POST",
    path: "/sigIn",
    handler: sigIn,

    schema: {
      body: S.object()
        .prop("username", S.string().required())
        .prop("name", S.string().required())
        .prop("surname", S.string().required())

        .prop("email", S.string().format(S.FORMATS.EMAIL).required())
        .prop("password", S.string().minLength(7).required())
        .prop("confirmPassword", S.string().minLength(7).required())
        .prop("role", S.string().default("user")),
    },
  });

  async function sigIn(req, reply) {
    try {
      const {
        username,
        name,
        surname,
        email,
        password,
        confirmPassword,
        role,
      } = req.body;
      if (password !== confirmPassword) {
        throw (
          (httpErrors.notAcceptable(
            400,
            "Password and Confirm Password do not match "
          ),
          reply
            .code(400)
            .send({ message: "Password and Confirm Password do not match" }))
        );
      }
      const user = await connection("accounts")
        .where({ username: username })
        .orWhere({ email: email })
        .first();

      // Check if the user exists or if the password is incorrect
      if (user) {
        throw (
          (httpErrors.notAcceptable(405, "Existing email or username!! "),
          reply.code(405).send({ message: "Existing email or username!! " }))
        );
      } else {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 8);

        await connection("accounts").insert({
          username: username,
          name: name,
          surname: surname,
          role: role,
          password: hashedPassword,
          email: email,
        });
      }

      reply.code(200).send({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error processing shopping:", error);
      httpErrors.internalServerError(500);
    }
  }
}
