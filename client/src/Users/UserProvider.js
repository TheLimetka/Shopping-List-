import React, { createContext, useState } from 'react';
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState('u1'); 
  const userMap = {
    u1: { id: 'u1', name: 'User 1' },
    u2: { id: 'u2', name: 'User 2' },
    u3: { id: 'u3', name: 'User 3' }
  };

  const switchUser = (userId) => {
    if (userMap[userId]) {
      setLoggedInUser(userId);
    }
  };

  return (
    <UserContext.Provider value={{ userMap, loggedInUser, switchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
