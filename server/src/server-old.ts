import express from 'express';

const app = express();

// "plugin" no express para receber dados no formato
// json
app.use(express.json());

// localhost:3333/users
// request - obter dados da requisição que está acontecendo na aplicação
// response - devolver uma resposta para a aplicacao que está utilizando

// rota: endereço completo da requisição (/users)
// recurso: qual entidade que estamos acessando no sistema
//          usuário da aplicação, neste exemplo

// MÉTODOS HTTP
// GET: Buscar uma ou mais informações do back-end.
//       Neste caso, esta sendo buscado uma lista de usários
// POST: Criar uma nova informação no back-end
//        Por exemplo, criação de um novo usuário
// PUT: Atualizar uma informação existente no back-end
//        Por exemplo, usuário já criado e precisamos atualizar 
//        uma informação
// DELETE: Remover uma informação do back-end

// Ex.
// POST: http://localhost:3333/users = criar um usuário
// GET: http://localhost:3333/users = listar usuários
// GET: http://localhost:3333/users/5 = listar dados do usuário com ID 5

// Insomnia - software para testar métodos http


// PARAMETROS
// - Request param: parâmetros que vem na própria rota que identificam um recurso
//                  por exemplo, quando precisar identificar um único cliente
// - Query param: parâmetros que vem na própria rota geralmente opcionais para
//                 filtros, paginação...
// - Rquest Body: parâmetros para criação/atualização de informações

// Knex.js: permite escrever as query em formato javascript
// - SQL: SELECT * FROM users WHERE name = "Fernando"
// - KNEX: knex('users').where('name', 'Fernando').select('*')


const users = [
    'Diego', // pos 0
    'Carlos', // pos 1
    'Fernando', // pos 2
    'Robson',
    'Cleiton',
];

app.get('/users', (request, response) => {
    //console.log('Listagem de usuários');
    
    // Quem esta fazendo a requisição que determina o nome do
    // parâmetro
    const search = String(request.query.search);

    const filteredUsers = search ? users.filter(user => user.includes(search)) : users;

    console.log(filteredUsers);

    return response.json(filteredUsers);
});

// Quando quer buscar um único usuário no back-end
// : significa que estou recebendo um parâmetro
app.get('/users/:id', (request, response) => {
    // pega o parâmetro 'id'
    // convert em número para ser utilizado como
    // parâmetro em users
    const id = Number(request.params.id); 

    const user = users[id];

    // no navegador irá ficar: localhost:3333/users/'id'

    return response.json(user);
});

app.post('/users', (request, response)=>{
    // Recebe dados do back-end
    const data = request.body;
    // Utiliza dados do back-end
    const user = {
        name: data.name,
        email: data.email
    };


    return response.json(user);
});

app.listen(3333);