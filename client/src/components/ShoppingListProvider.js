import React, { createContext, useState, useContext } from 'react';
import { initialShoppingLists } from '../data/initialData';

export const ShoppingListContext = createContext();

export const useShoppingList = () => useContext(ShoppingListContext);

export const ShoppingListProvider = ({ children }) => {
  const [shoppingLists, setShoppingLists] = useState(initialShoppingLists);

  const toggleArchiveList = (listId) => {
    setShoppingLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId 
          ? { ...list, isArchived: !list.isArchived } 
          : list
      )
    );
  };
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

  const renameList = (listId, newName) => {
    setShoppingLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId ? { ...list, name: newName } : list
      )
    );
  };

  const deleteShoppingList = (listId) => {
    setShoppingLists((prevLists) => prevLists.filter((list) => list.id !== listId));
  };

  const addItemToList = (listId, itemName) => {
    const newItem = { id: Date.now(), name: itemName, resolved: false };
    setShoppingLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? { ...list, items: [...list.items, newItem] }
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
                item.id === itemId
                  ? { ...item, resolved: !item.resolved }
                  : item
              )
            }
          : list
      )
    );
  };

  const addMemberToList = (listId, memberId) => {
    setShoppingLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? { ...list, members: [...new Set([...list.members, memberId])] }
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

  const leaveList = (listId, userId) => {
    setShoppingLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? { ...list, members: list.members.filter((id) => id !== userId) }
          : list
      )
    );
  };

  const value = {
    shoppingLists,
    createShoppingList,
    toggleArchiveList,
    renameList,
    deleteShoppingList,
    addItemToList,
    deleteItemFromList,
    toggleItemResolved,
    addMemberToList,
    removeMemberFromList,
    leaveList
  };

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
};