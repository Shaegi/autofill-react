import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ThemeProvider } from 'styled-components';
import client from './configureClient';
import { ApolloProvider } from '@apollo/react-hooks';
import DataContainer from './DataContainer';
import theme from './theme';



ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <DataContainer />
    </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

