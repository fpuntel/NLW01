import express from 'express';
import cors from 'cors';
import routes from './routes'; // Importa rotas do arquivo de rotas
import path from 'path';
import { errors } from 'celebrate';

const app = express();

// cors define quem pode ter acesso as informações
app.use(cors());

// "plugin" no express para receber dados no formato
// json
app.use(express.json());
app.use(routes);

// Caminho para apresentar as imagens
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

app.listen(3333);