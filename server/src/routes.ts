import express from 'express';
// Celebrate integração com o Joi para validação de dados
import { celebrate, Joi } from 'celebrate'; 
import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/PointsControllers';
import ItemsController from './controllers/ItemsControllers';

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

// Listar  itens
routes.get('/items', itemsController.index);


// Cadastro ponto
// inserido a variável uplado que irá receber a foto
// Joi validação dos campos
routes.post(
    '/points/', 
    upload.single('image'), 
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
        })
    }, { abortEarly: false}),
    pointsController.create);
    // abortEarly utilizado para fazer todas as validações ao mesmo tempo
    // verificando assim todos os pontos

// Pegar ponto especifico
routes.get('/points/:id', pointsController.show);
// Pegar ponto por cidade/estado
routes.get('/points/', pointsController.index);


// Preciso exportar as rotas para que o server.ts
// tenha acesso
export default routes;