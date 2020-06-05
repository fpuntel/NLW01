import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home';
import Points from './pages/Points';
import Detail from './pages/Detail';
import App from '../App';

// Funciona como roteamento da aplicação
const AppStack = createStackNavigator();

// Inserido screenOptions para que todas as telas tenham a mesma 
// configuração, neste caso, todas com background da mesma cor
// {{}} - uma chaves significa que quero colocar uma código javascript
//        a segunda chave significa que é um objeto

const Routes = () => {
    return (
        // NavigationContainer - define como as rotas devem ser comportar
        <NavigationContainer>
            <AppStack.Navigator
                headerMode="none"
                screenOptions={{
                    cardStyle: {
                        backgroundColor: '#f0f0f5'
                    }
                }}>
                <AppStack.Screen name="Home" component={Home} />
                <AppStack.Screen name="Points" component={Points} />
                <AppStack.Screen name="Detail" component={Detail} />
            </AppStack.Navigator>
        </NavigationContainer>
    )
}

export default Routes;
