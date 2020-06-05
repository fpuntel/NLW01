import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';
import api from '../../services/api';

import Dropzone from '../../components/Dropzone'

import './style.css';

import logo from '../../assets/logo.svg';

// Sempre que cria um array para estado ou objeto
// precisa manualmente iformar o tipo de variavel 
// armazenada ali dentro
// Por isso, faz uma interface dos tipos do
// objeto que vai receber (dos itens)
interface Item{
    id: number;
    title: string;
    image_url: string;
}
// Cria uma interface para pegar ser utilizada na useEffect
// para pegar todas as siglas
interface IBGEUFResponse{
    sigla: string;
}
interface IBGECityResponse{
    nome: string;
}

const CreatePoint = () => {
    // estado
    // faz um array da 'interface' item
    const [items, setItems] = useState<Item[]>([]);

    // Utilizado para definir a localização no mapa conforme o usuário
    const[initialPosition, setIinitialPosition] = useState<[number, number]>([0, 0]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    })

    // Vetor de string das UFs
    // utiliz a funcao setUfs para setar as ufs no useEffects
    // resultado irá para a variável ufs
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const[selectedUf, setSelectedUf] = useState('0');
    const[selectedCity, setSelectedCity] = useState('0');
    const[selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const[selectedItems, setSelectedItems] = useState<number[]>([]);
    const[selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position =>{
            const{latitude, longitude} = position.coords;

            setIinitialPosition([latitude, longitude]);
        })
    },[])

    // useEffect, 2 parametros:
    // 1 - qual funcao rodar
    // 2 - quando rodar
    useEffect(() => {
        // escreve somente items pois o api já foi
        // configurado com o caminho em services/api.ts
        api.get('items').then(response => {
            setItems(response.data);
        })
    }, []);

    useEffect(() => {
        // Informa que retorna um tipo IBGEUFResponse para pegar todas as
        // siglas do link do IBGE
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response=>{
            const ufInitials = response.data.map(uf => uf.sigla); // Pega todas as UFs
            setUfs(ufInitials); // Seta para o estado declarado inicialmente
        })
    }, []);

    useEffect(() =>{
        // carregar as cidades sempre que a UF mudar
        // 

        if(selectedUf === '0'){
            return;
        }

        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response=>{
                const cityName = response.data.map(city => city.nome); // Pega todas as UFs
                setCities(cityName); // Seta para o estado declarado inicialmente
        })

        // Colocado: selectedUf para informar que essa função deve ser alterada sempre que
        // a selectedUf alterar
    }, [selectedUf]);

    // Função para pegar o Uf selecionado pelo usuário
    // Preciso informar dentro de ChangeEvent de "onde vem" o dado
    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;
        setSelectedUf(uf);
    }


    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;
        setSelectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        //console.log(event.target.name)

        // name - name do input do html
        // value - valor digitado
        const{name, value} = event.target; 

        // Utilizado ... para "copiar" tudo que já tem dentro de formData
        // assim não se perde toda vez que o cliente alterar um dos campos
        // [name]: value - altera qual informação foi digitada
        setFormData({ ...formData, [name]: value })
    }

    function handleSelectItem(id: number){
        //Verifica se possui o id selecionado em selected item
        // caso tenha, retorna um valor maior que 1
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if(alreadySelected >= 0){
            // Item já estava na lista
            // Pega todos os itens, menos o igual o id
            const filtredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filtredItems);
        }else{
            // Significa que o item selecionado não estava na lista de
            // selectedItems e será adicionado
            setSelectedItems([...selectedItems, id]);
        }
        
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        // Pega todas as informações
        const { name, email, whatsapp} = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        // FormData classe global do javascript que permite enviar
        // arquivos...
        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));
        if(selectedFile){
            data.append('image', selectedFile)
        }
        // manda a api todos os dados para cadastro no banco
        await api.post('points', data);

        alert('Ponto de coleta criado!');

        // Volta para o home
        history.push('/');
        //console.log(data);
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />

                <Link to="/">
                    < FiArrowLeft />
                   Voltar para home
               </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                {// dropzone utilizado para inserir imagem
                }
                <Dropzone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                                name="uf" 
                                id="uf" 
                                value={selectedUf} 
                                onChange={handleSelectedUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                name="city" 
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectedCity}
                            >
                                    <option value="0">Selecione uma cidade</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um mais item abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li 
                                key={item.id} 
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>))}
                    </ul>
                </fieldset>
                <button type="submit"> Cadastrar Ponto de Coleta</button>
            </form>
        </div>
    );
}

export default CreatePoint;