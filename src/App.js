import React from "react";


import { Header } from "./components";
import { Home, Cart, Order, Profile } from "./pages";
import { Route, Routes } from "react-router-dom";



function App() {

  return (
    <div className="wrapper"> 
      <Header />
      <div className="content">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/cart" element={<Cart/>} />
          <Route exact path="/order" element={<Order/>} />
          <Route exact path="/profile" element={<Profile/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

