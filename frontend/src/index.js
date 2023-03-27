import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import './styles/main.scss';
import App from './App';

const theme = createTheme({
  colors: {
    primary: '#f1817b',
    secondary: '#0c266d',
    tertiary: '#f4f5fc',
    quaternary: '#eaeef4',
    quinary: '#dbe1ef',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
