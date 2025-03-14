import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
