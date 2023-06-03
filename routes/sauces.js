import S from 'fluent-json-schema'
import connection from '../db/db.js'



export default async function image(fastify, opts) {
    fastify.addHook('onRequest', fastify.authenticate)

    fastify.route({
      method: 'GET',
      path: '/sauces',
      handler: onSauces,
    });
  
    async function onSauces(req, reply) {
      try {
        const imagesData = await connection.select('image').from('sauces');
  
        if (imagesData.length === 0) {
          return fastify.httpErrors.notFound(404);
        }
  
        const imageResponses = imagesData.map(row => {
          const base64Image = row.image.toString('base64');
          return {
            image: base64Image,
             product: row.id,
             product_price: row.product_price,
          };
        });
  
        const response = {
          images: imageResponses,
        };
  
        reply.header('Content-Type', 'application/json').send(response);
      } catch (error) {
        fastify.httpErrors.internalServerError(500);
      }
    }
  }
  
  // async function serch(req, reply) {
  //   const quantity = req.body.quantyty 
  //   try {
  //     const imagesData = await connection.select('image','price', 'id').from('sauces');
  
  //     if (imagesData.length === 0) {
  //       return fastify.httpErrors.notFound(404);
  //     }
  
  //     const products = imagesData.map(row => {
  //       const base64Image = row.image.toString('base64');

  //       return {
  //         username: "user1",
  //         product: row.id,
  //         image: base64Image,
  //         quantity: quantity,
  //         product_price: row.product_price,
  //       }
  //     });
  
  //     reply.header('Content-Type', 'application/json').send(products);
  //   } catch (error) {
  //     fastify.httpErrors.internalServerError(500);
  //   }
  // }

  //tocca sviluppare la logica del front-end , dove verrà inviato un body per  url /shopping
  
  

