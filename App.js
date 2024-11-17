import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ShoppingListProvider } from './components/ShoppingListProvider';
import UserProvider from './Users/UserProvider';
import Header from './components/Header';
import AppRoutes from './components/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <UserProvider>
      <ShoppingListProvider>
        <Router>
          <Header />
          <div className="container mt-4">
            <AppRoutes />
          </div>
        </Router>
      </ShoppingListProvider>
    </UserProvider>
  );
}

export default App;