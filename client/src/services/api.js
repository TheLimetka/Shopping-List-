const BASE_URL = 'http://localhost:5000';

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'user_id': localStorage.getItem('userId') || '1',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(error.message || 'API request failed');
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return null;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

export const api = {
  // Shopping Lists
  getShoppingLists: () => 
    apiCall('/shoppinglist/list'),

  createShoppingList: (data) => 
    apiCall('/shoppinglist/create', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

    updateShoppingList: (id, data) => 
        apiCall(`/shoppinglist/update/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            ...data,
            isArchived: data.isArchived
          })
        }),

  deleteShoppingList: (id) => 
    apiCall(`/shoppinglist/delete/${id}`, {
      method: 'DELETE'
    }),

  // Shopping List Items
  addItemToList: (listId, data) => 
    apiCall(`/shoppinglist/${listId}/items`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateItem: (listId, itemId, data) => 
    apiCall(`/shoppinglist/${listId}/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteItem: (listId, itemId) => 
    apiCall(`/shoppinglist/${listId}/items/${itemId}`, {
      method: 'DELETE'
    }),

  // User Management
  getUsers: () => 
    apiCall('/users/list'),

  setAuthToken: (token) => {
    localStorage.setItem('userId', token);
  },

  clearAuthToken: () => {
    localStorage.removeItem('userId');
  }
};