import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import ShoppingListDetail from './ShoppingListDetail';
import { useShoppingList } from './ShoppingListProvider';

const AppRoutes = () => {
  const {
    shoppingLists,
    createShoppingList,
    renameList,
    deleteShoppingList,
    addItemToList,
    deleteItemFromList,
    toggleItemResolved,
    addMemberToList,
    removeMemberFromList,
    leaveList
  } = useShoppingList();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            shoppingLists={shoppingLists}
            createShoppingList={createShoppingList}
            renameList={renameList}
            deleteShoppingList={deleteShoppingList}
          />
        }
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
  );
};

export default AppRoutes;