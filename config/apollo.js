import {ApolloClient, InMemoryCache} from '@apollo/client';
import {setContext} from 'apollo-link-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createHttpLink} from 'apollo-link-http';

// Todavia no funciona con Heroku :(
// https://uptask-server.herokuapp.com/  NO LOCAL http://192.168.1.105:4000/ LOCAL

// En esta linea se cambia la IP ser server
let URI = `https://uptask-server.herokuapp.com`;

const httpLink = createHttpLink({
  uri: URI,
});

// uri: 'https://uptask-server.herokuapp.com',
const authLink = setContext(async (_, {headers}) => {
  // leer el token

  const token = await AsyncStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export default client;
