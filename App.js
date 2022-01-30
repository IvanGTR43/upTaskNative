import 'react-native-gesture-handler';

import React from 'react';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import CrearCuenta from './src/views/CrearCuenta';
import Login from './src/views/Login';
import Proyectos from './src/views/Proyectos';
import NuevoProyecto from './src/views/NuevoProyecto';
import Proyecto from './src/views/Proyecto';
import {convertRemToAbsolute} from 'native-base/lib/typescript/theme/tools';

const Stack = createStackNavigator();
const App = () => {
  return (
    <>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="login"
              component={Login}
              options={{title: 'Iniciar de Sesion', headerShown: false}}
            />
            <Stack.Screen
              name="crear-cuenta"
              component={CrearCuenta}
              options={{
                title: 'Crear Cuenta',
                headerStyle: {
                  backgroundColor: '#28303b',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen
              name="proyectos"
              component={Proyectos}
              options={{
                title: 'Proyectos',
                headerStyle: {
                  backgroundColor: '#28303b',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen
              name="nuevo-proyecto"
              component={NuevoProyecto}
              options={{
                title: 'Nuevo Proyecto',
                headerStyle: {
                  backgroundColor: '#28303b',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen
              name="proyecto"
              component={Proyecto}
              options={({route}) => ({
                title: route.params.nombre,
                headerStyle: {
                  backgroundColor: '#28303b',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </>
  );
};

export default App;
