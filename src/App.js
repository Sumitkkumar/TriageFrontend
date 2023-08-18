// src/App.js
import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import GetOrder from './components/GetOrder';
import "./App.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Analytics from './components/Analytics';
import Account from './components/Account';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
          <Sidebar />
          <Routes>
            <Route path="/getOrder" element={<GetOrder />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/account" element={<Account />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
