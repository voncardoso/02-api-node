import fastify from 'fastify'
import {knex} from "./database";
import crypto from 'node:crypto'
import {env} from "./env";


const app = fastify()

app.get('/hello', async () => {
    const transection = await knex('transactions').insert({
      id: crypto.randomUUID(),
      title: "transação teste",
      amount: 1000,
    }).returning("*")

  return transection
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:3333')
  })
