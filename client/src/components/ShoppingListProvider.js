import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

export const ShoppingListContext = createContext();

export const useShoppingList = () => useContext(ShoppingListContext);

export const ShoppingListProvider = ({ children }) => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadShoppingLists();
  }, []);

  const loadShoppingLists = async () => {
    try {
      setLoading(true);
      const lists = await api.getShoppingLists();
      setShoppingLists(Array.isArray(lists) ? lists : []);
      setError(null);
    } catch (err) {
      setError('Failed to load shopping lists');
      console.error('Error loading shopping lists:', err);
      setShoppingLists([]);
    } finally {
      setLoading(false);
    }
  };

  const createShoppingList = async (listName, ownerId) => {
    try {
      const newList = await api.createShoppingList({
        name: listName,
        owner_id: ownerId,
        member_ids: [ownerId],
        items: []
      });
      
      setShoppingLists(prev => [...prev, newList]);
      return newList;
    } catch (err) {
      setError('Failed to create list');
      throw err;
    }
  };

  const deleteShoppingList = async (listId) => {
    try {
      await api.deleteShoppingList(listId);
      setShoppingLists(prev => prev.filter(list => list.id !== listId));
    } catch (err) {
      setError('Failed to delete list');
      throw err;
    }
  };

  const renameList = async (listId, newName) => {
    try {
      const list = shoppingLists.find(l => l.id === listId);
      if (!list) throw new Error('List not found');

      const updatedList = await api.updateShoppingList(listId, {
        name: newName
      });
      
      setShoppingLists(prev => 
        prev.map(list => list.id === listId ? updatedList : list)
      );
    } catch (err) {
      setError('Failed to rename list');
      throw err;
    }
  };

  const toggleArchiveList = async (listId) => {
    try {
      const list = shoppingLists.find(l => l.id === listId);
      if (!list) throw new Error('List not found');

      const updatedList = await api.updateShoppingList(listId, {
        isArchived: !list.isArchived
      });
      
      setShoppingLists(prev => 
        prev.map(list => list.id === listId ? updatedList : list)
      );
    } catch (err) {
      setError('Failed to archive list');
      throw err;
    }
  };

  const addItemToList = async (listId, itemName) => {
    try {
      const newItem = await api.addItemToList(listId, {
        item_name: itemName,
        quantity: 1
      });
      
      setShoppingLists(prev => 
        prev.map(list => 
          list.id === listId 
            ? { 
                ...list, 
                items: [...(list.items || []), newItem] 
              }
            : list
        )
      );
      return newItem;
    } catch (err) {
      setError('Failed to add item');
      throw err;
    }
  };

  const deleteItemFromList = async (listId, itemId) => {
    try {
      await api.deleteItem(listId, itemId);
      
      setShoppingLists(prev => 
        prev.map(list => 
          list.id === listId
            ? {
                ...list,
                items: list.items.filter(item => item.item_id !== itemId)
              }
            : list
        )
      );
    } catch (err) {
      setError('Failed to delete item');
      throw err;
    }
  };

  const toggleItemResolved = async (listId, itemId) => {
    try {
      const list = shoppingLists.find(l => l.id === listId);
      const item = list?.items?.find(i => i.item_id === itemId);
      if (!item) throw new Error('Item not found');

      const updatedItem = await api.updateItem(listId, itemId, {
        is_solved: !item.is_solved
      });
      
      setShoppingLists(prev => 
        prev.map(list => 
          list.id === listId
            ? {
                ...list,
                items: list.items.map(item =>
                  item.item_id === itemId ? updatedItem : item
                )
              }
            : list
        )
      );
    } catch (err) {
      setError('Failed to update item');
      throw err;
    }
  };

  const addMemberToList = async (listId, memberId) => {
    try {
      const list = shoppingLists.find(l => l.id === listId);
      if (!list) throw new Error('List not found');

      const updatedList = await api.updateShoppingList(listId, {
        member_ids: [...(list.member_ids || []), memberId]
      });
      
      setShoppingLists(prev => 
        prev.map(list => list.id === listId ? updatedList : list)
      );
    } catch (err) {
      setError('Failed to add member');
      throw err;
    }
  };

  const removeMemberFromList = async (listId, memberId) => {
    try {
      const list = shoppingLists.find(l => l.id === listId);
      if (!list) throw new Error('List not found');

      const updatedList = await api.updateShoppingList(listId, {
        member_ids: list.member_ids.filter(id => id !== memberId)
      });
      
      setShoppingLists(prev => 
        prev.map(list => list.id === listId ? updatedList : list)
      );
    } catch (err) {
      setError('Failed to remove member');
      throw err;
    }
  };

  const leaveList = async (listId) => {
    try {
      const list = shoppingLists.find(l => l.id === listId);
      if (!list) throw new Error('List not found');

      await removeMemberFromList(listId, localStorage.getItem('userId') || '1');
      setShoppingLists(prev => prev.filter(list => list.id !== listId));
    } catch (err) {
      setError('Failed to leave list');
      throw err;
    }
  };

  const value = {
    shoppingLists,
    loading,
    error,
    createShoppingList,
    deleteShoppingList,
    renameList,
    toggleArchiveList,
    addItemToList,
    deleteItemFromList,
    toggleItemResolved,
    addMemberToList,
    removeMemberFromList,
    leaveList
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export default ShoppingListProvider;