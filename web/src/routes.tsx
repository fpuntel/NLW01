import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
// RouteProps
// BrowserRouter - para fazer roteamento

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';


// exact verifica se o caminho no navegador é igual
// sem o exact quando acessarmos o /create-point iria
// cair no Home por causa da barra no inicio
const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact/>
            <Route component={CreatePoint} path="/create-point"/>
        </BrowserRouter>
    )
}

export default Routes;