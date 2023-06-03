import knex from "knex";
import fp from "fastify-plugin";
import * as dotenv from 'dotenv'
dotenv.config()

const connection = knex({
  client: "mysql",
  connection: {
    host: process.env.HOST,
    port: process.env.PORT_DB,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  },
});


export default fp(connection);
