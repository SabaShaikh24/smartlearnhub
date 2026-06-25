import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { BookmarksProvider } from './Context/BookmarksContext.jsx';
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
ReactDOM.createRoot(document.getElementById('root')).render(
    
 <BrowserRouter>
 <BookmarksProvider>
     <App/>
 </BookmarksProvider>
 </BrowserRouter>

);
