import Knex from 'knex';


// Up utilizada para realizar alterações no banco
export async function up(knex: Knex){
    // Criar a tabela
    return knex.schema.createTable('point_items', table =>{
        table.increments('id').primary();

        table.integer('point_id')
            .notNullable()
            .references('id')
            .inTable('points');

        table.integer('items_id')
            .notNullable()
            .references('id')
            .inTable('items');;
    });
}

// Down utilizado para "voltar atrás"
export async function down(knex: Knex){
    return knex.schema.dropTable('point_items');
}