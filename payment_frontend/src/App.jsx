import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Pay from './pages/pay';
import Error from './pages/error';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/pay/:invoiceId' element={<Pay />}/>
        <Route path='*' element={<Error />}/>
      </Routes>
    </BrowserRouter>
  )
}