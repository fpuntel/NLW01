import {Request, Response} from 'express';
import knex from '../database/connection';

class ItemsController{
    async index  (request: Request, response: Response){
        const items = await knex('items').select('*'); // select todos itens
    
        // items map percorre todos os itens do banco de dados
        // e permite alterar-los (não no banco)
        const seralizedItems = items.map(item =>{
            return{
                id: item.id,
                title: item.title,
                image_url: `http://192.168.0.16:3333/uploads/${item.image}`,
            }
        });
    
        return response.json(seralizedItems);
    }
}

export default ItemsController;
