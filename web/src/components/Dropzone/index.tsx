import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi'

import './style.css';

// Cria interface para receber informações da imagem
// vinda de CreatePoint/index.tsx
interface Props{
    onFileUploaded:  (file: File) => void;
}

const Dropzone: React.FC<Props> = ({onFileUploaded}) => {
    const [selectedFileUrl, setselectedFileUrl] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        // Como so terá um arquivo, a imagem sempre estará na pos 0
        const file = acceptedFiles[0];

        const fileUrl = URL.createObjectURL(file);
        setselectedFileUrl(fileUrl);
        onFileUploaded(file);
    }, [onFileUploaded])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*' // Somente aceita imagens
    });

    return (
        <div className="dropzone" {...getRootProps()} >
            <input {...getInputProps()} accept="image/*" />

            {selectedFileUrl
                // Quando inserido a imagem o site irá apresentar a imagem
                // caso contrário apresenta uma mensagem
                ? <img src={selectedFileUrl} alt="Point thumbmail" />
                : (
                    <p>
                    <FiUpload />
                    Imagem do estabelecimento
                    </p>
                )
            }

        </div>
    )

}

export default Dropzone;