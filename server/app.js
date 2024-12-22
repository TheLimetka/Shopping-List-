const express = require('express');
const cors = require('cors');
const shoppingListRoutes = require('./endpoints/shopping_list');
const shoppingListItemRoutes = require('./endpoints/shopping_list_items');
const userRoutes = require('./endpoints/users');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use('/shoppinglist', shoppingListRoutes);
app.use('/shoppinglist', shoppingListItemRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});