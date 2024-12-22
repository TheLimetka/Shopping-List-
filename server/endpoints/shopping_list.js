const express = require('express');
const {
  validateCreateShoppingList,
  validateUpdateShoppingList,
  validate
} = require('../Validation/shopping-list-validation');
const dbHandler = require('../db/dbHandler');

const router = express.Router();

const authorizeMember = async (req, res, next) => {
  const userId = req.headers['user_id'];
  const shoppingListId = req.params.id;
  const shoppingLists = await dbHandler.getAllShoppingLists();
  const shoppingList = shoppingLists.find(list => list.id === shoppingListId);

  if (!shoppingList) {
    return res.status(404).json({ message: 'Shopping list not found.' });
  }

  if (shoppingList.owner_id !== userId && !shoppingList.member_ids?.includes(userId)) {
    return res.status(403).json({ message: 'You do not have permission to access this shopping list.' });
  }

  req.shoppingList = shoppingList;
  req.allShoppingLists = shoppingLists;
  next();
};

router.post('/create', validateCreateShoppingList, validate, async (req, res) => {
  try {
    const userId = req.headers['user_id'];
    const shoppingLists = await dbHandler.getAllShoppingLists() || [];
    
    const shoppingList = {
      id: `${(shoppingLists.length || 0) + 1}`,
      owner_id: userId,
      member_ids: [], // Initialize empty array
      items: [], // Initialize empty array
      isArchived: false,
      ...req.body,
      created_at: new Date().toISOString(),
    };
    
    // Ensure member_ids is always an array
    if (!Array.isArray(shoppingList.member_ids)) {
      shoppingList.member_ids = [];
    }
    
    shoppingLists.push(shoppingList);
    await dbHandler.saveShoppingLists(shoppingLists);
    
    res.status(201).json(shoppingList);
  } catch (error) {
    res.status(500).json({ message: 'Error creating shopping list', error: error.message });
  }
});

router.get('/list', async (req, res) => {
  try {
    const userId = req.headers['user_id'];
    const shoppingLists = await dbHandler.getAllShoppingLists();
    const accessibleLists = shoppingLists.filter(list => 
      list.owner_id === userId || list.member_ids?.includes(userId)
    );
    res.status(200).json(accessibleLists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shopping lists', error: error.message });
  }
});

router.get('/:id', authorizeMember, (req, res) => {
  res.status(200).json(req.shoppingList);
});

router.put('/update/:id', authorizeMember, validateUpdateShoppingList, validate, async (req, res) => {
  try {
    const shoppingLists = req.allShoppingLists;
    const listIndex = shoppingLists.findIndex(list => list.id === req.shoppingList.id);
    
    // Ensure member_ids remains an array during updates
    const updatedList = {
      ...shoppingLists[listIndex],
      ...req.body,
      member_ids: Array.isArray(req.body.member_ids) ? req.body.member_ids : shoppingLists[listIndex].member_ids
    };
    
    shoppingLists[listIndex] = updatedList;
    await dbHandler.saveShoppingLists(shoppingLists);
    res.status(200).json(updatedList);
  } catch (error) {
    res.status(500).json({ message: 'Error updating shopping list', error: error.message });
  }
});

router.delete('/delete/:id', authorizeMember, async (req, res) => {
  try {
    const shoppingLists = req.allShoppingLists;
    const updatedLists = shoppingLists.filter(list => list.id !== req.shoppingList.id);
    
    await dbHandler.saveShoppingLists(updatedLists);
    res.status(200).json({ message: 'Shopping list deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting shopping list', error: error.message });
  }
});

module.exports = router;