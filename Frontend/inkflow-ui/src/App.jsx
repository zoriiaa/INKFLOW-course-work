import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import Cart from './pages/Cart.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Profile from './pages/Profile.jsx';
import Orders from './pages/Orders.jsx';
import ProductDetails from './pages/ProductDetails.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/register" element={<Register/>} />
                <Route path="/home" element={<Home/>} />
                <Route path="/wishlist" element={<Wishlist/>} />
                <Route path="/cart" element={<Cart/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/orders" element={<Orders/>} />
                <Route path="/product/:id" element={<ProductDetails/>} />
                <Route path="/" element={<Navigate to="/home" />} />
            </Routes>
        </Router>
    );
}

export default App;