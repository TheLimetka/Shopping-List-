// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShoppingListProvider } from './components/ShoppingListProvider';
import UserProvider from './Users/UserProvider';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Home from './components/Home';
import ShoppingListDetail from './components/ShoppingListDetail';
import './i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <ShoppingListProvider>
          <Router>
            <div className="min-vh-100">
              <Header />
              <div className="container mt-4">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/list/:id" element={<ShoppingListDetail />} />
                </Routes>
              </div>
            </div>
          </Router>
        </ShoppingListProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;