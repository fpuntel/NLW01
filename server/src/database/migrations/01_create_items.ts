import Knex from 'knex';


// Up utilizada para realizar alterações no banco
export async function up(knex: Knex){
    // Criar a tabela
    return knex.schema.createTable('items', table =>{
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();
    });
}

// Down utilizado para "voltar atrás"
export async function down(knex: Knex){
    return knex.schema.dropTable('items');
}