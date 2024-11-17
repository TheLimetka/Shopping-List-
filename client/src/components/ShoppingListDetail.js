import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../Users/UserProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const ShoppingListDetail = ({
  shoppingLists,
  renameList,
  addItemToList,
  deleteItemFromList,
  toggleItemResolved,
  addMemberToList,
  removeMemberFromList,
  leaveList,
}) => {
  const { userMap, loggedInUser } = useContext(UserContext);
  const { id } = useParams();
  const listId = parseInt(id);
  const list = shoppingLists.find((list) => list.id === listId);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(list?.name || '');
  const [newItemName, setNewItemName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [showResolved, setShowResolved] = useState(true);
  
  if (!list || list.isArchived) {
    return (
      <div className="alert alert-warning">
        {!list ? 'Seznam nenalezen!' : 'Tento seznam je archivován a nelze jej upravovat.'}
      </div>
    );
  }
  if (!list || (list.owner !== loggedInUser && !list.members.includes(loggedInUser))) {
    return <div className="alert alert-danger">Přístup zamítnut!</div>;
  }

  const handleSaveNewName = () => {
    renameList(listId, newName);
    setIsEditing(false);
  };

  const handleAddItem = () => {
    if (newItemName.trim()) {
      addItemToList(listId, newItemName);
      setNewItemName('');
    } else {
      alert('Prosím zadejte platný název položky.');
    }
  };

  const handleToggleResolved = (itemId) => {
    toggleItemResolved(listId, itemId);
  };

  const handleDeleteItem = (itemId) => {
    deleteItemFromList(listId, itemId);
  };

  const handleAddMember = () => {
    const member = Object.values(userMap).find((user) => user.name === newMemberName);
    if (member) {
      addMemberToList(listId, member.id);
      setNewMemberName('');
    } else {
      alert('Zadaný uživatel neexistuje.');
    }
  };

  const handleRemoveMember = (memberId) => {
    removeMemberFromList(listId, memberId);
  };

  const handleLeaveList = () => {
    leaveList(listId, loggedInUser);
    navigate('/');
  };

  const filteredItems = list.items.filter((item) => showResolved || !item.resolved);

  return (
    <div>
      <div className="card mb-3 shadow-sm">
        <div className="card-body">
          {isEditing ? (
            <>
              <input
                type="text"
                className="form-control mb-2"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button onClick={handleSaveNewName} className="btn btn-success">
                Uložit
              </button>
              <button onClick={() => setIsEditing(false)} className="btn btn-secondary ml-2">
                Zrušit
              </button>
            </>
          ) : (
            <>
              <h2 className="card-title text-primary">{list.name}</h2>
              {list.owner === loggedInUser && (
                <button onClick={() => setIsEditing(true)} className="btn btn-outline-primary btn-sm">
                  Přejmenovat
                </button>
              )}
            </>
          )}

          <h3>Předměty</h3>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="showResolved"
              checked={showResolved}
              onChange={() => setShowResolved(!showResolved)}
            />
            <label className="form-check-label" htmlFor="showResolved">
            Zobrazit vyřešené položky
            </label>
          </div>
          <ul className="list-group mb-3">
            {filteredItems.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{item.name}</span>
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={item.resolved ? faCheckCircle : faCircle}
                    className={`icon ${item.resolved ? 'text-success' : 'text-muted'}`}
                    onClick={() => handleToggleResolved(item.id)}
                    style={{ cursor: 'pointer', fontSize: '1.5rem', marginRight: '10px' }}
                  />
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Smazat
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="New Item"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <div className="input-group-append">
              <button onClick={handleAddItem} className="btn btn-primary">Přidat položku</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title">Uživatelé</h3>
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Jméno uživatele"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
            />
            <div className="input-group-append">
              <button onClick={handleAddMember} className="btn btn-primary">Přidat uživatele</button>
            </div>
          </div>
          <ul className="list-group mt-3">
            {list.members.map((memberId) => {
              const member = userMap[memberId];
              return (
                <li key={memberId} className="list-group-item d-flex justify-content-between align-items-center">
                  {member ? member.name : 'Unknown'}
                  {loggedInUser === list.owner && memberId !== list.owner && (
                    <button
                      onClick={() => handleRemoveMember(memberId)}
                      className="btn btn-danger btn-sm"
                    >
                      Odebrat
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {loggedInUser !== list.owner && (
        <button onClick={handleLeaveList} className="btn btn-danger mt-3">
          Opustit seznam
        </button>
      )}
    </div>
  );
};

export default ShoppingListDetail;
