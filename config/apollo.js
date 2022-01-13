import {ApolloClient, InMemoryCache} from '@apollo/client';

import {HttpLink} from 'apollo-link-http';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://192.168.1.105:4000/',
  }),
});

export default client;
