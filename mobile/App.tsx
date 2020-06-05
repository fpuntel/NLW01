import React from 'react';
import { AppLoading } from 'expo';
import { StatusBar } from 'react-native';
import { Roboto_400Regular, Roboto_500Medium} from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu'

import Routes from './src/routes'

// JSX

export default function App() {

  // Para carregar as fontes
  // função useFonts deve ser importada
  const [fontLoaded] = useFonts({
    Roboto_400Regular, 
    Roboto_500Medium,
    Ubuntu_700Bold
  });

  // Caso não tenha carregado as fontes 
  // fica uma tela de loading
  if(!fontLoaded){
    return <AppLoading/>
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
      <Routes />
    </>
  );
}

// Style
// Não existe herança de estilos, ou seja,
// para cada "tipo" de item é preciso criar um stylo
// Cada elemento trabalha de forma única
