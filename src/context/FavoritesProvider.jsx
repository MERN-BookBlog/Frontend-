import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FavoritesProvider } from './FavoritesContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <FavoritesProvider>
    <App />
  </FavoritesProvider>
);
