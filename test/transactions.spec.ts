import { expect, test, beforeAll, afterAll } from 'vitest'
import  request from 'supertest'
import {app} from "../src/app";

// espera o servidor iniciar
beforeAll(async () => {
    await app.ready()
})

//ao fibnal dos teste ele fecha o servidor
afterAll(async () =>{
    await app.close()
})

test('o usuario consegue criar uma nova transação', async () => {
    const response = await request(app.server).post('/transactions').send({
        title: 'new transaction',
        amount: 5000,
        type: 'credit'
    })

    expect(response.statusCode).toEqual(201)
})