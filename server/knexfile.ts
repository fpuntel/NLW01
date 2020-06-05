import path from 'path';

// Arquivo para os arquivos knex
// Comando para criar o banco:
// npx knex migrate:latest --knexfile knexfile.ts migrate:latest

module.exports = {
    client:'sqlite3',
    connection: {
        filename: path.resolve(__dirname,'src', 'database', 'database.sqlite'),
    },
    // migrations - criar tabelas
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
    },
    // seeds - insert/update
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
    },
    useNullAsDefault: true,
};