import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './SettingsDropdown.css';

const SettingsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="settings-dropdown">
      <button onClick={toggleDropdown} className="settings-btn">
        <FontAwesomeIcon icon={faCog} />
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <a href="/profile">
            <FontAwesomeIcon icon={faUser} />
            <span>Perfil</span>
          </a>
          <a href="/logout">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Cerrar sesión</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;