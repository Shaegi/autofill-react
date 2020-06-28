import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from 'styled-components';
import client from './configureClient';
import { ApolloProvider } from '@apollo/react-hooks';


const sizes = {
  xxs: 4,
  xs: 8,
  s: 12,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
  '3xl': 52
}

const generateSizes = () => {
  return Object.keys(sizes).reduce<Record<string, any>>((acc, curr) => {
    if(!acc.raw) {
      acc.raw = {}
    }
    const value = sizes[curr as keyof typeof sizes]
    acc.raw[curr] = value
    acc[curr] = value + 'px'
    return acc
  }, {})
}

const theme = {
  color: {
    primary: "#c8aa6e",
    error: 'red'
  },
  size: generateSizes(),
  hspace: generateSizes(),
  vspace: generateSizes()
}

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

