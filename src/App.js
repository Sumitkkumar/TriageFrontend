// src/App.js
import { React } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import GetOrder from "./components/GetOrder";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inventory from "./components/Inventory";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <div className="contentContainer">
          <Sidebar />
          <Routes>
            <Route path="/getOrder" element={<GetOrder />} />
            <Route path="/inventoryStatus" element={<Inventory />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
