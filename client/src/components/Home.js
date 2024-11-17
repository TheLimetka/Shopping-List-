import React, { useContext, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext } from '../Users/UserProvider';
import { useShoppingList } from './ShoppingListProvider';

const Home = () => {
  const { userMap, loggedInUser } = useContext(UserContext);
  const { 
    shoppingLists, 
    createShoppingList, 
    deleteShoppingList,
    toggleArchiveList 
  } = useShoppingList();
  
  const [newListName, setNewListName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteListId, setDeleteListId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCreateList = () => {
    if (newListName.trim()) {
      createShoppingList(newListName, loggedInUser);
      setNewListName('');
      handleCloseModal();
    } else {
      alert('Prosím zadejte název nákupního seznamu.');
    }
  };

  const handleDeleteClick = (listId) => {
    setDeleteListId(listId);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    deleteShoppingList(deleteListId);
    setDeleteListId(null);
    setConfirmDelete(false);
  };

 
  const accessibleLists = shoppingLists.filter(
    (list) => (list.owner === loggedInUser || list.members.includes(loggedInUser))
  );

  const filteredLists = accessibleLists.filter(
    (list) => showArchived ? true : !list.isArchived
  );

  return (
    <div className="container text-center">
      <h1 className="my-4">Nákupní seznamy</h1>

      <div className="mb-4">
        <button onClick={handleOpenModal} className="btn btn-primary me-2">
          Vytvořit nový nákupní seznam
        </button>
        <button 
          onClick={() => setShowArchived(!showArchived)} 
          className="btn btn-outline-secondary"
        >
          {showArchived ? 'Skrýt archivované' : 'Zobrazit archivované'}
        </button>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Vytvořit nový nákupní seznam</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Název nákupního seznamu"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Zavřít
          </Button>
          <Button variant="primary" onClick={handleCreateList}>
            Vytvořit
          </Button>
        </Modal.Footer>
      </Modal>

      
      <Modal show={confirmDelete} onHide={() => setConfirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Opravdu chcete smazat tento nákupní seznam?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
            Zrušit
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Smazat
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="row">
        {filteredLists.map((list) => (
          <div key={list.id} className="col-md-4 mb-4">
            <div className={`card shadow-sm ${list.isArchived ? 'bg-light' : ''}`}>
              <div className="card-body">
                <h5 className="card-title">
                  {list.name}
                  {list.isArchived && (
                    <span className="badge bg-secondary ms-2">Archivováno</span>
                  )}
                </h5>
                <p className="card-text">
                  Vlastník: {userMap[list.owner]?.name || 'Unknown User'}
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  {list.owner === loggedInUser && (
                    <>
                      <button 
                        onClick={() => handleDeleteClick(list.id)} 
                        className="btn btn-outline-danger"
                      >
                        Smazat
                      </button>
                      <button
                        onClick={() => toggleArchiveList(list.id)}
                        className={`btn ${list.isArchived ? 'btn-outline-success' : 'btn-outline-secondary'}`}
                      >
                        {list.isArchived ? 'Obnovit' : 'Archivovat'}
                      </button>
                    </>
                  )}
                  <Link 
                    to={`/list/${list.id}`} 
                    className={`btn btn-primary ${list.isArchived ? 'disabled' : ''}`}
                  >
                    Zobrazit nákupní seznam
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
