import React, { useContext, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext } from '../Users/UserProvider';
import { useShoppingList } from './ShoppingListProvider';
import { useTranslation } from 'react-i18next';
import ShoppingListsOverview from './ShoppingListsOverview';

const Home = () => {
  const { t } = useTranslation();
  const { userMap, loggedInUser } = useContext(UserContext);
  const { 
    shoppingLists, 
    createShoppingList, 
    deleteShoppingList,
    toggleArchiveList 
  } = useShoppingList();
  
  const [newListName, setNewListName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCreateList = () => {
    if (newListName.trim()) {
      createShoppingList(newListName, loggedInUser);
      setNewListName('');
      handleCloseModal();
    } else {
      alert(t('Please enter a shopping list name'));
    }
  };

  const handleDeleteClick = (listId) => {
    setSelectedListId(listId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteShoppingList(selectedListId);
      setShowDeleteModal(false);
      setSelectedListId(null);
    } catch (error) {
      console.error('Failed to delete list:', error);
      alert(t('Failed to delete list'));
    }
  };

  const handleArchiveList = async (listId) => {
    try {
      await toggleArchiveList(listId);
    } catch (error) {
      console.error('Failed to archive list:', error);
      alert(t('Failed to archive list'));
    }
  };

  const accessibleLists = Array.isArray(shoppingLists) 
  ? shoppingLists.filter(list => 
      // First check if we should show this list based on archive status
      (showArchived || !list.isArchived) &&
      // Then check if user has access (is owner or member)
      (list.owner_id === loggedInUser || list.member_ids?.includes(loggedInUser))
    )
  : [];
  return (
    <div className="container text-center">
      <h1 className="my-4">{t('shoppingLists')}</h1>

      <div className="mb-4">
        <button onClick={handleOpenModal} className="btn btn-primary me-2">
          {t('createList')}
        </button>
        <button 
          onClick={() => setShowArchived(!showArchived)} 
          className="btn btn-outline-secondary"
        >
          {showArchived ? t('hideArchived') : t('showArchived')}
        </button>
      </div>

      {/* Shopping Lists Overview Chart */}
      <ShoppingListsOverview shoppingLists={accessibleLists} />

      {/* Create List Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t('createNewList')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control mb-3"
            placeholder={t('listName')}
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {t('close')}
          </Button>
          <Button variant="primary" onClick={handleCreateList}>
            {t('create')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('confirmDelete')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t('deleteConfirmMessage')}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {t('cancel')}
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            {t('delete')}
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="row justify-content-center">
        {accessibleLists.map((list) => (
          <div key={list.id} className="col-md-6 mb-4">
            <div className={`card ${list.isArchived ? 'bg-light' : ''}`}>
              <div className="card-body">
                <h5 className="card-title">
                  {list.name}
                  {list.isArchived && (
                    <span className="badge bg-secondary ms-2">{t('archived')}</span>
                  )}
                </h5>
                <p className="card-text">
                  {t('owner')}: {userMap[list.owner_id]?.name || t('Unknown User')}
                </p>
                <div className="d-flex justify-content-center gap-2">
                  {list.owner_id === loggedInUser && (
                    <>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteClick(list.id)}
                      >
                        {t('delete')}
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleArchiveList(list.id)}
                      >
                        {list.isArchived ? t('restore') : t('archive')}
                      </button>
                    </>
                  )}
                  <Link 
                    to={`/list/${list.id}`} 
                    className={`btn btn-primary ${list.isArchived ? 'disabled' : ''}`}
                  >
                    {t('viewList')}
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