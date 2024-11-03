// src/App.js
import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ShoppingListDetail from './components/ShoppingListDetail';
import UserProvider, { UserContext } from './Users/UserProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // Default data that resets on each reload
  const initialShoppingLists = [
    {
      id: 1,
      name: 'Potraviny',
      owner: 'u1',
      items: [{ id: 1, name: 'Mléko', resolved: false }, { id: 2, name: 'Chleba', resolved: true }],
      members: ['u1', 'u2']
    },
    {
      id: 2,
      name: 'Elektro',
      owner: 'u1',
      items: [{ id: 3, name: 'Kabel HDMI', resolved: false }],
      members: ['u3']
    }
  ];

  const [shoppingLists, setShoppingLists] = useState(initialShoppingLists);

  // Function to create a new shopping list
  const createShoppingList = (listName, ownerId) => {
    const newList = {
      id: Date.now(),
      name: listName,
      owner: ownerId,
      items: [],
      members: [ownerId]
    };
    setShoppingLists((prevLists) => [...prevLists, newList]);
  };

  // Function to rename a shopping list
  const renameList = (listId, newName) => {
    setShoppingLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId ? { ...list, name: newName } : list
      )
    );
  };

  const addItemToList = (listId, itemName) => {
    setShoppingLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: [...list.items, { id: Date.now(), name: itemName, resolved: false }]
            }
          : list
      )
    );
  };

  const deleteItemFromList = (listId, itemId) => {
    setShoppingLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
          : list
      )
    );
  };

  const toggleItemResolved = (listId, itemId) => {
    setShoppingLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId ? { ...item, resolved: !item.resolved } : item
              )
            }
          : list
      )
    );
  };

  const addMemberToList = (listId, memberId) => {
    setShoppingLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId && !list.members.includes(memberId)
          ? { ...list, members: [...list.members, memberId] }
          : list
      )
    );
  };

  const removeMemberFromList = (listId, memberId) => {
    setShoppingLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? { ...list, members: list.members.filter((id) => id !== memberId) }
          : list
      )
    );
  };

  const leaveList = (listId, memberId) => {
    setShoppingLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? { ...list, members: list.members.filter((id) => id !== memberId) }
          : list
      )
    );
  };

  return (
    <UserProvider>
      <Router>
        <Header />
        <div className="container mt-4">
          <Routes>
            <Route
              path="/"
              element={<Home shoppingLists={shoppingLists} createShoppingList={createShoppingList} renameList={renameList} />}
            />
            <Route
              path="/list/:id"
              element={
                <ShoppingListDetail
                  shoppingLists={shoppingLists}
                  renameList={renameList}
                  addItemToList={addItemToList}
                  deleteItemFromList={deleteItemFromList}
                  toggleItemResolved={toggleItemResolved}
                  addMemberToList={addMemberToList}
                  removeMemberFromList={removeMemberFromList}
                  leaveList={leaveList}
                />
              }
            />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

// Header Component for user switching
const Header = () => {
  const { userMap, loggedInUser, switchUser } = useContext(UserContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <a className="navbar-brand" href="/">Nákupní seznam</a>
      <div className="ml-auto">
        <label htmlFor="userSelect" className="text-light mr-2">Uživatel:</label>
        <select
          id="userSelect"
          className="form-control d-inline-block"
          style={{ width: 'auto' }}
          onChange={(e) => switchUser(e.target.value)}
          value={loggedInUser}
        >
          {Object.values(userMap).map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
};

export default App;
