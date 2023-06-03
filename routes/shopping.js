import S from "fluent-json-schema";
import connection from "../db/db.js";

//the logic is organized as follows: the frontend on the sauce Url will take care of creating an array that will be sent on the Shopping url into Body
// data is exemple

//Exemple
const data = [
  {
    username: "user1",
    product: "3",
    image: "path/immagine1.jpg",
    quantity: 2,
    product_price: 9.99,
  },
  {
    username: "user2",
    product: "2",
    image: "path/immagine2.jpg",
    quantity: 1,
    product_price: 10,
  },
];

export default async function shopping(fastify, opts) {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.route({
    method: "POST",
    path: "/shopping",
    handler: shopping,

    schema: {
      body: S.array().items(
        S.object()
          .prop("username", S.string().required())
          .prop("product", S.string().required())
          .prop("image", S.string().required())
          .prop("quantity", S.integer().required())
          .prop("product_price", S.number().required())
      ),
      response: {
        200: S.object().prop("total_price", S.number()),
      },
    },
  });

  async function shopping(req, reply) {
    let total_price = 0;
    const body = req.body;
    try {
      await connection.transaction(async (trx) => {
        for (const item of body) {
          const { username, product, quantity, product_price } = item;

          // Check if the product already exists in the database for the user
          const productExists = await trx("shopping")
            .where("username", username)
            .andWhere("product", product)
            .first();

          if (!productExists) {
            // The product doesn't exist, so insert the item as a new entry
            await trx("shopping").insert(item);
          } else {
            // The product exists, so update the existing entry with new quantity and price
            const updatedQuantity = productExists.quantity + quantity;
            const updatedPrice = productExists.product_price + product_price;

            await trx("shopping")
              .where("username", username)
              .andWhere("product", product)
              .update({
                quantity: updatedQuantity,
                product_price: updatedPrice,
              });
          }
        }

        // Calculate the total price for each user in parallel using Promise.all
        const promises = data.map((item) =>
          trx("shopping")
            .select("product_price", "quantity")
            .where("username", item.username)
        );
        const results = await Promise.all(promises);

        // Sum the product prices to get the total price
        total_price = results.reduce(
          (accumulator, current) =>
            accumulator + current[0].product_price * current[0].quantity,
          0
        );
      });

      const formattedTotalNumber = total_price.toFixed(2);
      const products = req.body.map((item) => item.product);

      const order = {
        amount: formattedTotalNumber,
        products: products,
      };
console.log(order)
      reply.send({ total_price: formattedTotalNumber, order: order });
    } catch (error) {
      console.error("Error processing shopping:", error);
      httpErrors.internalServerError(500);
    }
  }

  //delete
  fastify.route({
    method: "DELETE",
    path: "/shopping/delete/:id",
    handler: deleteOrder,
    schema: {
      params: S.object().prop("id", S.integer().required()),
    },
  });

  async function deleteOrder(req, reply) {
    try {
      const id = req.params.id;

      const rowsDel = await connection("shopping")
        .where("id", id)

        .first()
        .del();

      if (rowsDel === 0 || !rowsDel) {
        reply
          .code(400)
          .send({ message: "No order found with the specified ID" });
      } else {
        reply.code(200).send({ message: "Order deleted successfully" });
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      httpErrors.internalServerError(500);
    }
  }
}
