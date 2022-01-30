import {ApolloClient, InMemoryCache} from '@apollo/client';
import {setContext} from 'apollo-link-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createHttpLink} from 'apollo-link-http';

const httpLink = createHttpLink({
  uri: 'http://192.168.1.105:4000/',
});

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
