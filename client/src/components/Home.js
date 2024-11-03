// src/components/Home.js
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../Users/UserProvider';

const Home = ({ shoppingLists, createShoppingList, renameList }) => {
  const { userMap, loggedInUser } = useContext(UserContext);
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState(null);
  const [newName, setNewName] = useState('');

  const getUserNameById = (userId) => {
    return userMap[userId]?.name || 'Unknown User';
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      createShoppingList(newListName, loggedInUser); // Pass `loggedInUser` as `ownerId`
      setNewListName('');
    }
  };

  const startEditing = (listId, currentName) => {
    setEditingListId(listId);
    setNewName(currentName);
  };

  const saveNewName = (listId) => {
    renameList(listId, newName);
    setEditingListId(null);
    setNewName('');
  };

  // Filter lists based on user access (owner or member)
  const accessibleLists = shoppingLists.filter(
    (list) => list.owner === loggedInUser || list.members.includes(loggedInUser)
  );

  return (
    <div className="container text-center">
      <h1 className="my-4">Nákupní seznamy</h1>

      {/* Form to create a new shopping list */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Jméno nového seznamu"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <button onClick={handleCreateList} className="btn btn-primary">
          Vytvořit nový seznam
        </button>
      </div>

      <div className="row">
        {accessibleLists.map((list) => (
          <div key={list.id} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                {editingListId === list.id ? (
                  <>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                    <button onClick={() => saveNewName(list.id)} className="btn btn-success">
                      Uložit
                    </button>
                    <button onClick={() => setEditingListId(null)} className="btn btn-secondary ml-2">
                      Zrušit
                    </button>
                  </>
                ) : (
                  <>
                    <h5 className="card-title">{list.name}</h5>
                    <p className="card-text">
                      Vlastník: {getUserNameById(list.owner)}
                    </p>
                    {list.owner === loggedInUser && (
                      <button onClick={() => startEditing(list.id, list.name)} className="btn btn-outline-primary btn-sm">
                        Přejmenovat
                      </button>
                    )}
                    <Link to={`/list/${list.id}`} className="btn btn-primary mt-2">
                      Zobrazit nákupní seznam
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
