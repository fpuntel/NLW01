import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController{

    async index(request: Request, response: Response){
        // cidade, uf, items (query params)
        const {city, uf, items} = request.query;
    
        // como o dado de item virá com virgula é preciso dividir em um array
        // trim retira os espaços da esquerda e da direita
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim())); 

        const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .whereIn('point_items.items_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*');

                // items map percorre todos os itens do banco de dados
        // e permite alterar-los (não no banco)
        const seralizedPoints = points.map(point =>{
            return{
                ...point,
                image_url: `http://192.168.0.16:3333/uploads/${point.image}`,
            }
        });
    

        return response.json(seralizedPoints);
    }

    async show(request: Request, response: Response){
        const {id} = request.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return response.status(400).json({message: 'Point not found.'});
        }

        const seralizedPoint = {
                ...point,
                image_url: `http://192.168.0.16:3333/uploads/${point.image}`,
        };

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.items_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({point : seralizedPoint, items});
    }

    async create (request: Request, response: Response){
        // Desestruturação do javascript
        // igual a: const name = request.body.name
        // para todas as variáveis
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city, 
            uf,
            items
        } = request.body;
    
        // Transactions utilizada para garantir que as duas execucoes
        // só sejam concluidas se ambas funcionarem
        const trx = await knex.transaction();
    
        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city, 
            uf
        };

        // insert retorna os dados inseridos
        // utilizado a variável para utilizar o id 
        // na relação dos pontos e itens
        const insertedIds = await trx('points').insert(point);
        //const insertedIds = await knex('points').insert(point);

        const point_id = insertedIds[0]; // pega o id inserido
        // pega os itens cadastrados
        const pointItems = items
            .split(',')
            .map((item: String) => Number(item.trim()))
            .map((items_id: number) => {
                return{
                    items_id, 
                    point_id, 
                };
        });
    
        await trx('point_items').insert(pointItems);
        //await knex('point_items').insert(pointItems);

        // Sempre que utilizar transaction é preciso utilizar o commit
        await trx.commit();

        return response.json({
            id: point_id,
            ...point,
        });
    }

};


export default PointsController;
