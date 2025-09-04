import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './head-dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHome, faShareNodes, faUsers, faFileContract, 
  faHandHoldingDollar, faTruck, faPlus, faSignOutAlt,
  faRefresh, faExclamationTriangle, faSearch,
  faCog, faTools
} from '@fortawesome/free-solid-svg-icons'

interface UserData {
  id: string;
  name: string;
  email: string;
  role: number; 
  avatar?: string;
}

const HeadDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('resumen');
  const [showConstruction, setShowConstruction] = useState(false);
  const [constructionMessage, setConstructionMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // Cargar datos del usuario
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtener token del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Cargar datos del usuario desde localStorage
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        try {
          const user = JSON.parse(userDataStr);
          setUserData(user);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const showConstructionMessage = (message: string) => {
    setConstructionMessage(message);
    setShowConstruction(true);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Intentar cerrar sesión en la API
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error durante logout:', error);
    } finally {
      // Limpiar localStorage siempre
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  const handleNewProject = () => {
    showConstructionMessage("Crear nuevo proyecto - Esta funcionalidad está en construcción");
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    showConstructionMessage(`Sección ${section} - Esta funcionalidad está en construcción`);
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleName = (role: number) => {
    switch (role) {
      case 1: return 'Administrador';
      case 2: return 'Director';
      default: return 'Usuario';
    }
  };

  const renderConstructionContent = () => (
    <div className="construction-content">
      <div className="construction-icon">
        <span className="construction-emoji">🚧</span>
      </div>
      <h2>En Construcción</h2>
      <p>Esta sección está actualmente en desarrollo. Estamos trabajando para brindarte la mejor experiencia.</p>
      <div className="construction-features">
        <div className="feature-item">
          <FontAwesomeIcon icon={faUsers} />
          <span>Gestión de Proyectos</span>
        </div>
        <div className="feature-item">
          <FontAwesomeIcon icon={faFileContract} />
          <span>Control de Contratos</span>
        </div>
        <div className="feature-item">
          <FontAwesomeIcon icon={faHandHoldingDollar} />
          <span>Seguimiento de Pagos</span>
        </div>
        <div className="feature-item">
          <FontAwesomeIcon icon={faTruck} />
          <span>Administración de Proveedores</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout-root">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="brand-header">
          <a href="#">
            <img src="/src/assets/img/H-b.png" alt="Logo H Group" className="brand-logo" />
          </a>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li className={activeSection === 'resumen' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); handleSectionChange('resumen'); }} className="nav-link">
                <FontAwesomeIcon icon={faHome} />
                <span className="title-menu">Resumen</span>
              </a>
            </li>
            <li className={activeSection === 'proyectos' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); handleSectionChange('proyectos'); }} className="nav-link">
                <FontAwesomeIcon icon={faShareNodes} />
                <span className="title-menu">Proyectos</span>
              </a>
            </li>
            <li className={activeSection === 'marcas' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); handleSectionChange('marcas'); }} className="nav-link">
                <FontAwesomeIcon icon={faUsers} />
                <span className="title-menu">Marcas/Clientes</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); handleSectionChange('contratos'); }} className="nav-link">
                <FontAwesomeIcon icon={faFileContract} />
                <span className="title-menu">Contratos</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); handleSectionChange('cobranza'); }} className="nav-link">
                <FontAwesomeIcon icon={faHandHoldingDollar} />
                <span className="title-menu">Cobranza/Pagos</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); handleSectionChange('proveedores'); }} className="nav-link">
                <FontAwesomeIcon icon={faTruck} />
                <span className="title-menu">Proveedores</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {userData?.name ? getUserInitials(userData.name) : 'HD'}
            </div>
            <div className="user-info">
              <span className="user-name">{userData?.name || 'Usuario'}</span>
              <span className="user-role">{userData ? getRoleName(userData.role) : 'Director'}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="section-header">
            <div className="header-title">
              <h1 className="page-title">
                {activeSection === 'resumen' && 'Resumen Ejecutivo'}
                {activeSection === 'proyectos' && 'Gestión de Proyectos'}
                {activeSection === 'marcas' && 'Gestión de Marcas'}
                {activeSection === 'contratos' && 'Gestión de Contratos'}
                {activeSection === 'cobranza' && 'Cobranza y Pagos'}
                {activeSection === 'proveedores' && 'Gestión de Proveedores'}
              </h1>
              <span className="header-subtitle">HEAD / Dashboard</span>
            </div>

            <div className="header-actions">
              <div className="search-box">
                <FontAwesomeIcon icon={faSearch} />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  value={searchTerm} 
                  onChange={handleSearchChange}
                  disabled={true}
                  title="Búsqueda en construcción"
                />
              </div>
              <button onClick={handleNewProject} className="new-project-btn" disabled={true} title="Función en construcción">
                <FontAwesomeIcon icon={faPlus} />
                <span>Nuevo Proyecto</span>
              </button>
              <button onClick={loadUserData} className="refresh-btn">
                <FontAwesomeIcon icon={faRefresh} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <section className="dashboard-section">
          {error ? (
            <div className="error-message">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <span>{error}</span>
              <button onClick={loadUserData} className="retry-btn">
                Reintentar
              </button>
            </div>
          ) : isLoading ? (
            <div className="loading-message">Cargando dashboard...</div>
          ) : (
            renderConstructionContent()
          )}
        </section>
      </main>

      {/* Mensaje de Construcción */}
      {showConstruction && (
        <>
          <div className="construction-overlay" onClick={() => setShowConstruction(false)}></div>
          <div className="construction-message">
            <div className="construction-header">
              <span className="construction-emoji">🚧</span>
              <h3>En Construcción</h3>
            </div>
            <p>{constructionMessage}</p>
            <button onClick={() => setShowConstruction(false)} className="close-btn">
              Entendido
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HeadDashboard;