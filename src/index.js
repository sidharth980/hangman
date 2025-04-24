import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Assuming you have a Tailwind CSS setup
import Hangman from './Hangman';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Hangman />
  </React.StrictMode>
);
reportWebVitals();
