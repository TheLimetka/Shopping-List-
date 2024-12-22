import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../Users/UserProvider';
import { useShoppingList } from './ShoppingListProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ShoppingListDetailChart from './ShoppingListDetailChart';

const ShoppingListDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { userMap, loggedInUser } = useContext(UserContext);
  const { 
    shoppingLists,
    addItemToList,
    deleteItemFromList,
    toggleItemResolved,
    addMemberToList,
    removeMemberFromList,
    leaveList,
    renameList
  } = useShoppingList();

  // State
  const [newItemName, setNewItemName] = useState('');
  const [showResolved, setShowResolved] = useState(true);
  const [newMemberName, setNewMemberName] = useState('');
  const [listName, setListName] = useState('');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false);

  // Find the current list
  const list = shoppingLists?.find(l => l.id === id);

  if (!list) {
    return (
      <div className="alert alert-warning">
        {t('listNotFound')}
      </div>
    );
  }

  // Check access rights
  const isOwner = list.owner_id === loggedInUser;
  const isMember = list.member_ids?.includes(loggedInUser);
  const hasAccess = isOwner || isMember;

  if (!hasAccess) {
    return <div className="alert alert-danger">{t('accessDenied')}</div>;
  }

  // Handlers
  const handleAddItem = async () => {
    if (newItemName.trim()) {
      try {
        await addItemToList(id, newItemName);
        setNewItemName('');
      } catch (error) {
        alert(t('failedToAddItem'));
      }
    }
  };

  const handleToggleResolved = async (itemId) => {
    try {
      await toggleItemResolved(id, itemId);
    } catch (error) {
      alert(t('failedToToggleItem'));
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItemFromList(id, itemId);
    } catch (error) {
      alert(t('failedToDeleteItem'));
    }
  };

  const handleAddMember = async () => {
    const member = Object.values(userMap).find(user => user.name === newMemberName);
    if (member) {
      try {
        await addMemberToList(id, member.id);
        setNewMemberName('');
        setShowAddMemberModal(false);
      } catch (error) {
        alert(t('failedToAddMember'));
      }
    } else {
      alert(t('userNotFound'));
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeMemberFromList(id, memberId);
    } catch (error) {
      alert(t('failedToRemoveMember'));
    }
  };

  const handleLeaveList = async () => {
    try {
      await leaveList(id);
      setShowLeaveConfirmModal(false);
      navigate('/');
    } catch (error) {
      alert(t('failedToLeaveList'));
    }
  };

  const handleRename = async () => {
    if (listName.trim()) {
      try {
        await renameList(id, listName);
        setShowRenameModal(false);
      } catch (error) {
        alert(t('failedToRenameList'));
      }
    }
  };

  // Filter items based on showResolved
  const items = list.items || [];
  const filteredItems = showResolved ? items : items.filter(item => !item.is_solved);

  return (
    <div className="container">
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="card-title mb-0">{list.name}</h2>
            {isOwner && (
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  setListName(list.name);
                  setShowRenameModal(true);
                }}
              >
                {t('renameList')}
              </button>
            )}
          </div>

          <p className="text-muted">
            {t('owner')}: {userMap[list.owner_id]?.name || t('unknownUser')}
          </p>

          {/* Items Section */}
          <div className="mb-4">
            <h4>{t('items')}</h4>
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="showResolved"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="showResolved">
                {t('showResolvedItems')}
              </label>
            </div>

            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder={t('newItem')}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              />
              <button 
                className="btn btn-primary"
                onClick={handleAddItem}
              >
                {t('addItem')}
              </button>
            </div>

            <ul className="list-group mb-4">
              {filteredItems.map((item) => (
                <li 
                  key={item.item_id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span className={item.is_solved ? 'text-muted' : ''}>
                    {item.item_name}
                  </span>
                  <div>
                    <button
                      className={`btn btn-link me-2 ${item.is_solved ? 'text-success' : 'text-muted'}`}
                      onClick={() => handleToggleResolved(item.item_id)}
                    >
                      <FontAwesomeIcon 
                        icon={item.is_solved ? faCheckCircle : faCircle} 
                        size="lg"
                      />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteItem(item.item_id)}
                    >
                      {t('delete')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Items Status Chart */}
            <div className="mb-4">
              <h4>Items Status</h4>
              <ShoppingListDetailChart items={items} />
            </div>
          </div>

          {/* Members Section */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">{t('members')}</h4>
              {isOwner && (
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setShowAddMemberModal(true)}
                >
                  {t('addMember')}
                </button>
              )}
            </div>

            <ul className="list-group">
              {list.member_ids?.map((memberId) => {
                const member = userMap[memberId];
                return (
                  <li 
                    key={memberId}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {member?.name || t('unknownUser')}
                    {isOwner && memberId !== list.owner_id && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveMember(memberId)}
                      >
                        {t('removeMember')}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="d-flex justify-content-between">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              {t('backToList')}
            </button>
            {!isOwner && (
              <button 
                className="btn btn-danger"
                onClick={() => setShowLeaveConfirmModal(true)}
              >
                {t('leaveList')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rename Modal */}
      <Modal show={showRenameModal} onHide={() => setShowRenameModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('renameList')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder={t('listName')}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRenameModal(false)}>
            {t('cancel')}
          </Button>
          <Button variant="primary" onClick={handleRename}>
            {t('save')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Member Modal */}
      <Modal show={showAddMemberModal} onHide={() => setShowAddMemberModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('addMember')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            placeholder={t('enterUsername')}
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddMemberModal(false)}>
            {t('cancel')}
          </Button>
          <Button variant="primary" onClick={handleAddMember}>
            {t('add')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Leave Confirm Modal */}
      <Modal show={showLeaveConfirmModal} onHide={() => setShowLeaveConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('leaveList')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t('leaveListConfirmation')}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLeaveConfirmModal(false)}>
            {t('cancel')}
          </Button>
          <Button variant="danger" onClick={handleLeaveList}>
            {t('leave')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShoppingListDetail;