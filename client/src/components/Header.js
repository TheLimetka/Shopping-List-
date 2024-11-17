// src/components/Header.js
import React, { useContext } from 'react';
import { UserContext } from '../Users/UserProvider';

function Header() {
  const { userMap, loggedInUser, switchUser } = useContext(UserContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <a className="navbar-brand" href="/">Nákupní seznam</a>
      <div className="ml-auto d-flex align-items-center">
        <label htmlFor="userSelect" className="text-light mr-2 mb-0">Uživatel:</label>
        <select
          id="userSelect"
          className="form-control d-inline-block ml-2"
          style={{ width: 'auto' }}
          onChange={(e) => switchUser(e.target.value)}
          value={loggedInUser}
        >
          {Object.values(userMap).map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}

export default Header;
