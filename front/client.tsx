import React from 'react';
import App from '@layouts/App';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

const root = createRoot(document.querySelector('#app') as HTMLElement);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
