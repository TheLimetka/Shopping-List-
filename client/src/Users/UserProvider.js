import React, { createContext, useState } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState('1');
  
  const userMap = {
    '1': { id: '1', name: 'Alice' },
    '2': { id: '2', name: 'Bob' },
    '3': { id: '3', name: 'Jonáš' }
  };

  const switchUser = (userId) => {
    if (userMap[userId]) {
      setLoggedInUser(userId);
    }
  };

  return (
    <UserContext.Provider value={{ 
      userMap, 
      loggedInUser, 
      switchUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;