import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import {execSync} from 'node:child_process'
import  request from 'supertest'
import {app} from "../src/app";

describe('transactions route', () => {
    // espera o servidor iniciar
    beforeAll(async () => {
        await app.ready()
    })

//ao fibnal dos teste ele fecha o servidor
    afterAll(async () =>{
        await app.close()
    })


    beforeEach(async () => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    it('o usuario consegue criar uma nova transação', async () => {
        const response = await request(app.server).post('/transactions').send({
            title: 'new transaction',
            amount: 5000,
            type: 'credit'
        })

        expect(response.statusCode).toEqual(201)
    })

    it('should be able to list all transactions', async () => {
        const creteTransactionResponse = await request(app.server).post('/transactions').send({
            title: 'new transaction',
            amount: 5000,
            type: 'credit'
        })

        const cookies = creteTransactionResponse.get('Set-Cookie')

        const listTransactionsResponse =
            await request(app.server)
                .get('/transactions')
                .set('Cookie', cookies)
                .expect(200)

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'new transaction',
                amount: 5000
            })
        ])
    })


    it('should be able to get a specific transaction', async () => {
        const creteTransactionResponse = await request(app.server).post('/transactions').send({
            title: 'new transaction',
            amount: 5000,
            type: 'credit'
        })

        const cookies = creteTransactionResponse.get('Set-Cookie')

        const listTransactionsResponse =
            await request(app.server)
                .get('/transactions')
                .set('Cookie', cookies)
                .expect(200)

        const id = listTransactionsResponse.body.transactions[0].id

        const getTransactionsResponse =
            await request(app.server)
                .get(`/transactions/${id}`)
                .set('Cookie', cookies)
                .expect(200)

        expect(getTransactionsResponse.body.transaction).toEqual(
            expect.objectContaining({
                title: 'new transaction',
                amount: 5000
            })
        )
    })

    it('should be able to get the sumary', async () => {
        const creteTransactionResponse = await request(app.server).post('/transactions').send({
            title: 'Credite transaction',
            amount: 5000,
            type: 'credit'
        })

        const cookies = creteTransactionResponse.get('Set-Cookie')

         await request(app.server).post('/transactions').set('Cookie', cookies).send({
            title: 'Debit transaction',
            amount: 2000,
            type: 'debit'
        })

        const sumaryResponse =
            await request(app.server)
                .get('/transactions/summary')
                .set('Cookie', cookies)
                .expect(200)

        expect(sumaryResponse.body.summary).toEqual({
            amount: 3000, // credite + debit
        })
    })
})

