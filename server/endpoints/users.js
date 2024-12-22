const express = require('express');
const { validateregisterUser, validateloginUser } = require('../Validation/user_validation');
const { validate } = require('../Validation/shopping-list-validation');

const router = express.Router();


const users = [
  {
    id: '1',
    name: 'Alice',
    password: 'KJKSZPJ'
  },
  {
    id: '2',
    name: 'Bob',
    password: 'BAGUVIX'
  },
  {
		id: '3',
		name: 'Jonáš',
		password: 'AEZAKMI'
	}
];


router.post('/login', validateloginUser, validate, (req, res) => {
  const { name, password } = req.body;

  const user = users.find(u => u.name === name && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }


  const token = user.id;
  res.status(200).json({ token });
});


router.post('/create', validateregisterUser, validate, (req, res) => {
  const user = {
    id: `${users.length + 1}`,
    ...req.body
  };
  users.push(user);
  res.status(201).json(user);
});


router.get('/list', (req, res) => {
  res.status(200).json(users);
});


router.get('/:id', (req, res) => {
  const userId = req.params.id;
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  res.status(200).json(user);
});


router.put('/update/:id', validateregisterUser, validate, (req, res) => {
  const userId = req.params.id;
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  Object.assign(user, req.body);
  res.status(200).json(user);
});


router.delete('/delete/:id', (req, res) => {
  const userId = req.params.id;
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found.' });
  }

  users.splice(userIndex, 1);
  res.status(200).json({ message: 'User deleted successfully.' });
});

module.exports = router;
