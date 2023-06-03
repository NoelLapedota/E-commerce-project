import S from "fluent-json-schema";
import connection from "../db/db.js";

export default async function address(fastify, opts) {
  fastify.addHook("onRequest", fastify.authenticate);

  const { httpErrors } = fastify;

  fastify.route({
    method: "POST",
    path: "/address",
    handler: address,

    schema: {
      body: S.object()

        .prop("address", S.string().required())
        .prop("code", S.integer().required())
        .prop("city", S.string().required())
        .prop("country", S.string().required())
        .prop("phone", S.integer()),
    },
  });


  async function address(req, reply) {
    try {
      const { address, code, city, country, phone } = req.body;

        const findAddress = await connection("address")
        .where("address", address)
        .andWhere("id", req.id)
        .andWhere("code", code)
        .andWhere("city", city)
        .andWhere("country", country)
        .first();
      if (!findAddress) {
        const newAddress = await connection("address").insert({
          id: req.id,
          address: address,
          code: code,
          city: city,
          country: country,
          phone: phone,
        });

      } else {
        reply.code(409).send({
          messagge: "address already present, select from the list!!",
        });
      }
      reply.code(200).send({ message: "User registered successfully" });

    } catch (error) {
      console.error("Error processing address:", error);
      httpErrors.internalServerError(500);
    }
  }

  //select
  fastify.route({
    method: "GET",
    path: "/address/select",
    handler: selectAddress,
  });

  async function selectAddress(req, reply) {
    try {
      const selectAddress = await connection("address")
        .select()
        .where("id", req.id);

      reply.code(200).send({ address: selectAddress });
    } catch (error) {
      console.error("Error select address:", error);
      httpErrors.internalServerError(500);
    }
  }

  // Dall front selezionare l'indirizzo prendere idAdress e passarlo nel params

  //update
  fastify.route({
    method: "PUT",
    path: "/address/update/:idAddress",
    handler: updateAddress,
    schema: {
      params: S.object().prop("idAddress", S.integer().required()),
      body: S.object()
        .prop("address", S.string().required())
        .prop("code", S.integer().required())
        .prop("city", S.string().required())
        .prop("country", S.string().required())
        .prop("phone", S.integer()),
    },
  });

  async function updateAddress(req, reply) {
    try {
      const idAddress = req.params.idAddress;
      const { address, code, city, country, phone } = req.body;

      const rowsUpdated = await connection("address")
        .where("idAddress", idAddress)

        .first()
        .update({
          address: address,
          code: code,
          city: city,
          country: country,
          phone: phone,
        });
      if (rowsUpdated === 0 || !idAddress) {
        reply.code(400).send({ message: "No address found with the specified idAddress" });
      } else {
        reply.code(200).send({ message: "Address updated successfully" });
      }
    } catch (error) {
      console.error("Error updating address:", error);
      httpErrors.internalServerError(500);
    }
  }

  //delete
  fastify.route({
    method: "DELETE",
    path: "/address/delete/:id",
    handler: deletAddress,
    schema: {
      params: S.object().prop("id", S.integer().required()),
    },
  });

  async function deletAddress(req, reply) {
    try {
      const addressId = req.params.id;

      const rowsUpdated = await connection("address")
        .where("idAddress", addressId)

        .first()
        .del();

      if (deletedAddress === 0 || !addressId) {
        reply.code(400).send({ message: "No address found with the specified ID" });
      } else {
        reply.code(200).send({ message: "Address deleted successfully" });
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      httpErrors.internalServerError(500);
    }
  }
}
