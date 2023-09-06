// src/App.js
import { React } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GetOrder from "./routes/GetOrder.jsx";
import Inventory from "./routes/Inventory.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <div className="contentContainer">
          <Sidebar />
          <Routes>
            <Route path="/" element={<GetOrder />} />
            <Route path="/getOrder" element={<GetOrder />} />
            <Route path="/inventoryStatus" element={<Inventory />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
