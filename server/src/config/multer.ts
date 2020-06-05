import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export default{
    storage: multer.diskStorage({
        // path.resolve para permitir que se use em diferentes SO
        // assim, o resolve irá utilizar a barra correta e arquivos
        // resolvendo o caminho do jeito mais certo
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename(request, file, callback){
            // preciso gerar um nome unico para cada arquivo
            // converte para uma string hexadecimal
            const hash = crypto.randomBytes(6).toString('hex');

            // nome do arquivo: hash-nomeDoarquivo
            const fileName = `${hash}-${file.originalname}`;

            callback(null, fileName);
        }
    })
}