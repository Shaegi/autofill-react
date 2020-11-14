import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  uri: process.env.REACT_APP_SERVER_URL,
  cache: new InMemoryCache()
})

export default client