import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './admin-dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags, faSearch, faEllipsisV, faChartLine, faPercent, faSignOutAlt, faRefresh, faExclamationTriangle, faPlus, faDownload, faEdit, faTrash, faEye, faTimes, faUserShield } from '@fortawesome/free-solid-svg-icons'

interface Brand {
  id: string;
  nombre: string;
  tipo: string;
  responsable: string;
  color: string;
  logo: string;
  ventas: string;
  margen: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: number; // 1 = admin, 2 = head
  avatar?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showConstruction, setShowConstruction] = useState(false);
  const [constructionMessage, setConstructionMessage] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Verificar rol y cargar datos
  useEffect(() => {
    const checkAccessAndLoadData = async () => {
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

          // Verificar si el usuario tiene rol de administrador (1)
          if (user.role !== 1) {
            setAccessDenied(true);
            setIsLoading(false);
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
              if (user.role === 2) {
                navigate('/head-dashboard');
              } else {
                navigate('/login');
              }
            }, 2000);
            return;
          }

          // Si es admin, cargar los datos
          await loadDashboardData();

        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          setError('Error al cargar datos de usuario');
          setIsLoading(false);
        }
      } else {
        setError('No se encontraron datos de usuario');
        setIsLoading(false);
      }
    };

    checkAccessAndLoadData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) return;

      // Intentar cargar marcas desde la API
      try {
        const brandsResponse = await fetch(`${API_URL}/brands`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (brandsResponse.ok) {
          const brandsData = await brandsResponse.json();
          setBrands(brandsData);
          setFilteredBrands(brandsData);
        } else {
          // Si la API falla, usar datos locales como fallback
          console.warn('API no disponible, usando datos locales');
          await loadLocalBrands();
        }
      } catch (apiError) {
        console.warn('Error conectando con la API, usando datos locales:', apiError);
        await loadLocalBrands();
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar marcas locales como fallback
  const loadLocalBrands = async () => {
    try {
      // Importar datos locales
      const { brands: localBrands } = await import("../../assets/data/brands");
      setBrands(localBrands);
      setFilteredBrands(localBrands);
    } catch (localError) {
      console.error('Error cargando datos locales:', localError);
      setError('No se pudieron cargar las marcas');
    }
  };

  // Filtrar marcas basado en el término de búsqueda
  useEffect(() => {
    const filtered = brands.filter(brand =>
      brand.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.responsable.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
  }, [searchTerm, brands]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const showConstructionMessage = (message: string) => {
    setConstructionMessage(message);
    setShowConstruction(true);
  };

  const handleBrandClick = () => {
    showConstructionMessage("Esta funcionalidad está en construcción");
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

  const exportToCSV = () => {
    const headers = ['Nombre', 'Tipo', 'Responsable', 'Ventas', 'Margen'];
    const csvData = filteredBrands.map(brand => [
      brand.nombre,
      brand.tipo,
      brand.responsable,
      brand.ventas,
      brand.margen
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `marcas-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddBrand = () => {
    showConstructionMessage("Agregar nueva marca - Esta funcionalidad está en construcción");
  };

  const handleBrandAction = (action: string, brandId: string) => {
    showConstructionMessage(`${action} marca - Esta funcionalidad está en construcción`);
    setActiveMenu(null);
  };

  const toggleMenu = (brandId: string) => {
    setActiveMenu(activeMenu === brandId ? null : brandId);
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

  // Si el acceso está denegado, mostrar mensaje
  if (accessDenied) {
    return (
      <div className="access-denied-container">
        <div className="access-denied-content">
          <FontAwesomeIcon icon={faUserShield} size="4x" className="access-denied-icon" />
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder al panel de administración.</p>
          <p>Serás redirigido automáticamente a tu dashboard correspondiente.</p>
          <div className="loading-redirect">
            <div className="loading-spinner"></div>
            <span>Redirigiendo...</span>
          </div>
        </div>
      </div>
    );
  }

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
            <li className="active">
              <a href="#" data-section="marcas" className="nav-link">
                <FontAwesomeIcon icon={faTags} />
                <span className="title-menu">Gestor de Marcas</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {userData?.name ? getUserInitials(userData.name) : 'US'}
            </div>
            <div className="user-info">
              <span className="user-name">{userData?.name || 'Usuario'}</span>
              <span className="user-role">{userData ? getRoleName(userData.role) : 'Usuario'}</span>
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
          <div className="header-left">
            <h1 className="page-title">Panel de Control</h1>
            {isLoading && <span className="loading-text">Cargando...</span>}
          </div>
          <div className="header-actions">
            <button onClick={loadDashboardData} className="refresh-btn">
              <FontAwesomeIcon icon={faRefresh} />
            </button>
          </div>
        </header>

        {/* Sección de Marcas */}
        <section id="marcas" className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Gestión de Marcas</h2>
            <div className="section-actions">
              <div className="search-box">
                <FontAwesomeIcon icon={faSearch} />
                <input 
                  type="text" 
                  placeholder="Buscar marca..." 
                  value={searchTerm} 
                  onChange={handleSearchChange}
                  disabled={isLoading}
                />
              </div>
              <div className="action-buttons">
                <button onClick={exportToCSV} className="export-btn">
                  <FontAwesomeIcon icon={faDownload} />
                  <span>Exportar CSV</span>
                </button>
                <button onClick={handleAddBrand} className="add-btn">
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Nueva Marca</span>
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <div className="error-message">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <span>{error}</span>
              <button onClick={loadDashboardData} className="retry-btn">
                Reintentar
              </button>
            </div>
          ) : isLoading ? (
            <div className="loading-message">Cargando marcas...</div>
          ) : filteredBrands.length === 0 ? (
            <div className="empty-message">
              {searchTerm ? 'No se encontraron marcas con ese criterio' : 'No hay marcas disponibles'}
            </div>
          ) : (
            <div className="brands-grid">
              {filteredBrands.map((brand) => (
                <div key={brand.id} className="brand-card">
                  <div className="brand-header" style={{ background: brand.color }}>
                    <div className="brand-logo">
                      <img src={`/src/assets/iconos/${brand.logo}`} alt={brand.nombre} />
                    </div>
                    <div className="brand-title">
                      <h3>{brand.nombre}</h3>
                      <span className="brand-category">{brand.tipo}</span>
                    </div>
                    <div className="brand-actions">
                      <button 
                        className="menu-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(brand.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                      {activeMenu === brand.id && (
                        <div className="dropdown-menu">
                          <button onClick={() => handleBrandAction('Ver', brand.id)} className="dropdown-item">
                            <FontAwesomeIcon icon={faEye} />
                            <span>Ver detalles</span>
                          </button>
                          <button onClick={() => handleBrandAction('Editar', brand.id)} className="dropdown-item">
                            <FontAwesomeIcon icon={faEdit} />
                            <span>Editar</span>
                          </button>
                          <button onClick={() => handleBrandAction('Eliminar', brand.id)} className="dropdown-item delete">
                            <FontAwesomeIcon icon={faTrash} />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="brand-body" onClick={handleBrandClick}>
                    <div className="brand-responsible">
                      <div className="responsible-avatar">
                        {getUserInitials(brand.responsable)}
                      </div>
                      <div className="responsible-info">
                        <div className="responsible-name">{brand.responsable}</div>
                        <div className="responsible-role">Responsable</div>
                      </div>
                    </div>
                    <div className="metrics-grid">
                      <div className="metric-item">
                        <div className="metric-label">
                          <FontAwesomeIcon icon={faChartLine} /> Ventas Mensuales
                        </div>
                        <div className="metric-value">{brand.ventas}</div>
                      </div>
                      <div className="metric-item">
                        <div className="metric-label">
                          <FontAwesomeIcon icon={faPercent} /> Margen
                        </div>
                        <div className="metric-value">{brand.margen}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Mensaje de Construcción */}
      {showConstruction && (
        <>
          <div className="construction-overlay" onClick={() => setShowConstruction(false)}></div>
          <div className="construction-message">
            <h3>🚧 En Construcción</h3>
            <p>{constructionMessage}</p>
            <button onClick={() => setShowConstruction(false)}>
              <FontAwesomeIcon icon={faTimes} /> Entendido
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;