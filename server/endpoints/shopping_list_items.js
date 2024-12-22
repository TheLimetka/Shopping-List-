const express = require('express');
const { 
  validateCreateItem, 
  validateUpdateItem,
  validate 
} = require('../Validation/shopping-list-validation');
const dbHandler = require('../db/dbHandler');

const router = express.Router();

const authorizeMember = async (req, res, next) => {
    const userId = req.headers['user_id'];
    const shoppingListId = req.params.listId;
    const shoppingLists = await dbHandler.getAllShoppingLists();
    const shoppingList = shoppingLists.find(list => list.id === shoppingListId);
  
    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found.' });
    }
  
    if (shoppingList.owner_id !== userId && !shoppingList.member_ids.includes(userId)) {
      return res.status(403).json({ message: 'You do not have permission to access this shopping list.' });
    }
  
    req.shoppingList = shoppingList;
    req.allShoppingLists = shoppingLists;
    next();
};

router.post('/:listId/items', authorizeMember, validateCreateItem, validate, async (req, res) => {
    try {
      const newItem = {
        item_id: Date.now().toString(),
        item_name: req.body.item_name,
        quantity: req.body.quantity || 1,
        is_solved: false,
        created_at: new Date().toISOString()
      };
  
      const shoppingLists = req.allShoppingLists;
      const listIndex = shoppingLists.findIndex(list => list.id === req.shoppingList.id);
      
      if (!Array.isArray(shoppingLists[listIndex].items)) {
        shoppingLists[listIndex].items = [];
      }
      
      shoppingLists[listIndex].items.push(newItem);
      await dbHandler.saveShoppingLists(shoppingLists);
      
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ message: 'Error adding item to shopping list', error: error.message });
    }
});

router.get('/:listId/items', authorizeMember, async (req, res) => {
    try {
      const items = req.shoppingList.items || [];
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
});

router.put('/:listId/items/:itemId', authorizeMember, validateUpdateItem, validate, async (req, res) => {
    try {
      const shoppingLists = req.allShoppingLists;
      const listIndex = shoppingLists.findIndex(list => list.id === req.shoppingList.id);
      const itemIndex = shoppingLists[listIndex].items?.findIndex(item => item.item_id === req.params.itemId);
      
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found.' });
      }
      
      shoppingLists[listIndex].items[itemIndex] = {
        ...shoppingLists[listIndex].items[itemIndex],
        ...req.body
      };
      
      await dbHandler.saveShoppingLists(shoppingLists);
      res.status(200).json(shoppingLists[listIndex].items[itemIndex]);
    } catch (error) {
      res.status(500).json({ message: 'Error updating item', error: error.message });
    }
});

router.delete('/:listId/items/:itemId', authorizeMember, async (req, res) => {
    try {
      const shoppingLists = req.allShoppingLists;
      const listIndex = shoppingLists.findIndex(list => list.id === req.shoppingList.id);
      
      if (!Array.isArray(shoppingLists[listIndex].items)) {
        return res.status(404).json({ message: 'Item not found.' });
      }
      
      const updatedItems = shoppingLists[listIndex].items.filter(
        item => item.item_id !== req.params.itemId
      );
      
      shoppingLists[listIndex].items = updatedItems;
      await dbHandler.saveShoppingLists(shoppingLists);
      
      res.status(200).json({ message: 'Item deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting item', error: error.message });
    }
});

module.exports = router;