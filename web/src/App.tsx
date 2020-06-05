import React from 'react';
import './App.css';

import Routes from './routes'

// JSX: Sintaxe de XML dentro do Javascript
// Componente: utilizado quando pode repertir algum trecho
//             por exemplo, twitter.
// Propriedade: "parâmetro" para enviar para um componente
// Estado: armazenar uma informação a partir do componente
  // Retorna um array: 
  //  [0]: valor do estado
  //  [1]: funcao para atualizar o valor do estado
  //const [counter, setCounter] = useState(0); 
function App() {
  return (
    <div>
      <Routes />
    </div>
  );
}

export default App;
