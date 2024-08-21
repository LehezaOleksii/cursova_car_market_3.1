import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './App';
import ErrorHandler from './components/errors/ErrorHandler ';
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.render(    
<BrowserRouter> 
<ErrorHandler>
<App />
</ErrorHandler>
</BrowserRouter> , document.getElementById('root')
);
