// Migrations = histórico do banco de dados
// Toda vez que um banco for alterado será criado uma nova migrations

// ex.
// 2 desenvolvedores:
// um cria uma tabela points
// outro cria uma tabela users
// com o migrations junta as duas tabelas com o mesmo formato
// para os dois progradores
import Knex from 'knex';


// Up utilizada para realizar alterações no banco
export async function up(knex: Knex){
    // Criar a tabela
    return knex.schema.createTable('points', table =>{
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();
    });
}

// Down utilizado para "voltar atrás"
export async function down(knex: Knex){
    return knex.schema.dropTable('points');
}