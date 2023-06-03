

 export default async function logout (fastify, opts) {

    fastify.route({
      method: 'GET', 
      path: '/logout',
      handler: onLogout    })
  
    async function onLogout (req, reply) {
        reply.code(200).send({ message: 'User logout successfully' });   
    } 
    
  }