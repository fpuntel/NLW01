import React from 'react';
import ReactDOM from 'react-dom'; // React na web - se integre com a DOM
import App from './App';

// Renderizar essa componente App dentro da id root
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
