import type { Knex } from "knex";

// o que a migration vai fazer
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions', (table) => {
        table.uuid("id").primary()
        table.text("title").notNullable()
        table.decimal("amount", 10,2).notNullable()
        table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable()
    })
}

// aconteceu algo errado, faz o contrario do que up faz
export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('transactions')
}

