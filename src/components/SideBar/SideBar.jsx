import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserDoctor,
  faUserInjured,
  faPills,
  faFileMedical,
  faChevronLeft,
  faChevronRight,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { Sun, Moon } from 'lucide-react';
import { useState, useContext } from 'react';
import ThemeContext from '../../context/ThemeContext';
import './SideBar.css';

const SideBar = ({ userType, onLogout }) => {
  const { selectedTheme, handleThemeToggle } = useContext(ThemeContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const drawerItems = {
    doctor: [
      { icon: faUserDoctor, title: 'Appointments', path: '/appointments' },
      { icon: faUserInjured, title: 'Patients', path: '/patients' },
      { icon: faPills, title: 'Prescriptions', path: '/prescriptions' },
      { icon: faFileMedical, title: 'Medical Records', path: '/records' },
    ],
    patient: [
      { icon: faUserDoctor, title: 'Appointments', path: '/appointments' },
      { icon: faPills, title: 'Medications', path: '/medications' },
      { icon: faFileMedical, title: 'Lab Results', path: '/lab-results' },
      { icon: faUserInjured, title: 'Health History', path: '/health-history' },
    ],
    pharmacy: [
      { icon: faPills, title: 'Medical Supplies', path: '/supplies' },
      { icon: faFileMedical, title: 'Orders', path: '/orders' },
      { icon: faUserDoctor, title: 'Inventory', path: '/inventory' },
      { icon: faUserInjured, title: 'Shipments', path: '/shipments' },
    ],
  };

  const items = drawerItems[userType] || [];

  const handleSidebarToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <aside
      className={`sidebar-container ${isExpanded ? 'expanded' : 'collapsed'}`}
      aria-label="Main Navigation"
    >
      <div className="sidebar-content">
        {/* Header Section */}
        <div className="sidebar-header">
          {isExpanded && 
            <span className="logo-text">HealthPro</span>
            }
          <button
            onClick={handleSidebarToggle}
            className="toggle-button"
            aria-label={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <FontAwesomeIcon
              icon={isExpanded ? faChevronLeft : faChevronRight}
            />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {items.map(({ icon, title, path }) => (
            <Link
              key={path}
              to={path}
              className={`nav-item ${
                location.pathname === path ? 'active' : ''
              }`}
              title={!isExpanded ? title : ''}
            >
              <FontAwesomeIcon icon={icon} className="nav-icon" />
              {isExpanded && <span className="nav-text">{title}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="sidebar-footer">
          <button
            className="toggle-button"
            onClick={handleThemeToggle}
            aria-label={`Switch to ${
              selectedTheme === 'light' ? 'dark' : 'light'
            } mode`}
          >
            {selectedTheme === 'light' ? <Moon /> : <Sun />}
          </button>
          <button
            onClick={onLogout}
            className="logout-button"
            title={!isExpanded ? 'Logout' : ''}
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="nav-icon" />
            {isExpanded && <span className="nav-text">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
