const fs = require('fs').promises;
const path = require('path');

class DbHandler {
  constructor() {
    this.usersPath = path.join(__dirname, 'users.json');
    this.shoppingListsPath = path.join(__dirname, 'shopping-lists.json');
    this.initializeFiles();
  }

  async initializeFiles() {
    try {
      await this.getAllUsers();
    } catch (error) {
      await this.saveUsers([]);
    }

    try {
      await this.getAllShoppingLists();
    } catch (error) {
      await this.saveShoppingLists([]);
    }
  }

  // Users operations
  async getAllUsers() {
    try {
      const data = await fs.readFile(this.usersPath, 'utf8');
      const parsed = JSON.parse(data);
      return parsed.users || [];
    } catch (error) {
      return [];
    }
  }

  async saveUsers(users) {
    await fs.writeFile(this.usersPath, JSON.stringify({ users }, null, 2));
  }

  // Shopping lists operations
  async getAllShoppingLists() {
    try {
      const data = await fs.readFile(this.shoppingListsPath, 'utf8');
      const parsed = JSON.parse(data);
      return parsed.shopping_lists || [];
    } catch (error) {
      return [];
    }
  }

  async saveShoppingLists(shopping_lists) {
    await fs.writeFile(this.shoppingListsPath, JSON.stringify({ shopping_lists }, null, 2));
  }
}

module.exports = new DbHandler();