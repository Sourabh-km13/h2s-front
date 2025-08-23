import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import OrderPage from "./page/OrderPage";
import Header from "./components/Header";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
     
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/orders" element={<OrderPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
