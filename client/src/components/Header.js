// src/components/Header.js
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../Users/UserProvider';
import { useTheme } from '../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faLanguage } from '@fortawesome/free-solid-svg-icons';

function Header() {
  const { userMap, loggedInUser, switchUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'cs' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <a className="navbar-brand" href="/">
          {t('appName')}
        </a>
        <div className="d-flex align-items-center gap-3">
          {/* Language Toggle */}
          <button
            className="btn btn-outline-secondary"
            onClick={toggleLanguage}
            title={i18n.language === 'en' ? 'Přepnout na češtinu' : 'Switch to English'}
          >
            <FontAwesomeIcon icon={faLanguage} className="me-2" />
            {i18n.language === 'en' ? 'CZ' : 'EN'}
          </button>

          {/* Theme Toggle */}
          <button
            className="btn btn-outline-secondary"
            onClick={toggleTheme}
            title={isDarkMode ? t('lightMode') : t('darkMode')}
          >
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          </button>

          {/* User Selector */}
          <select
            className="form-select"
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
      </div>
    </nav>
  );
}

export default Header;