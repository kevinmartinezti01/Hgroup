import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/H.png';

// Interface para los datos del formulario
interface LoginFormData {
  email: string;
  password: string;
}

// Interface para la respuesta de la API
interface LoginResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    dashboardPath: string;
    // Agrega otras propiedades del usuario según necesites
  };
}

const Login: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const infoToggleRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mejor práctica: usar variables de entorno con valores por defecto
  const API_URL = import.meta.env.VITE_API_URL;
  if (!API_URL) {
    console.warn('VITE_API_URL no está definida, usando valor por defecto');
  }
  const API_BASE = API_URL || 'http://localhost:3000/api';

  // Usar useCallback para funciones que se pasan como dependencias
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar mensajes cuando el usuario empiece a escribir
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  }, [error, successMessage]); // Dependencias actualizadas

  // Función para validar el formulario
  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('Email y contraseña son requeridos');
      return false;
    }
    
    // Validación de email más robusta
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return false;
    }
    
    return true;
  };

  // Manejo de errores centralizado
  const handleError = (error: unknown) => {
    let errorMessage = 'Error al iniciar sesión';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    setError(errorMessage);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    // Validación mejorada
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        })
      });

      // Manejar respuestas no OK
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data: LoginResponse = await response.json();

      // Almacenar tokens y datos de usuario
      localStorage.setItem('token', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
      localStorage.setItem('userData', JSON.stringify(data.user));

      // Mostrar mensaje de éxito
      setSuccessMessage('¡Autenticación exitosa! Redirigiendo...');

      // Redirigir según el rol (usando dashboardPath del backend)
      setTimeout(() => {
        navigate(data.user.dashboardPath || '/dashboard', { replace: true });
      }, 1500);

    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para cerrar el panel si se hace clic fuera de él (optimizado)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showInfo &&
        infoPanelRef.current &&
        !infoPanelRef.current.contains(event.target as Node) &&
        infoToggleRef.current &&
        !infoToggleRef.current.contains(event.target as Node)
      ) {
        setShowInfo(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInfo]);

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="brand-header">
          <img src={logo} alt="H Group Logo" className="logo" />
          <h1>Plataforma HGROUP</h1>
        </div>

        <form onSubmit={handleLogin} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="email">Correo Corporativo</label>
            <input 
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu.email@hgroup.consulting" 
              required 
              disabled={isLoading}
              autoComplete="username"
              autoFocus // Mejora la UX
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              autoComplete="current-password"
              minLength={8}
            />
          </div>

          {error && (
            <div className="error-message" role="alert">
              <i className="error-icon">⚠️</i> {error}
            </div>
          )}

          {successMessage && (
            <div className="success-message" role="alert">
              <i className="success-icon">✅</i> {successMessage}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
            aria-busy={isLoading}
            aria-label={isLoading ? "Autenticando" : "Iniciar Sesión"}
          >
            {isLoading ? (
              <>
                <span className="spinner" aria-hidden="true"></span> Autenticando...
              </>
            ) : 'Iniciar Sesión'}
          </button>

          <div className="form-footer">
            <Link to="/forgot-password" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>

        <div className="login-footer">
          <p>Sistema exclusivo para colaboradores</p>
          <p>v1.0 © 2025</p>
        </div>

        <div ref={infoPanelRef} className={`info-panel ${showInfo ? 'active' : ''}`}>
          <div className="info-content">
            <h2>Información de la Plataforma</h2>
            {/* ... (contenido existente) ... */}
          </div>
        </div>

        <div 
          ref={infoToggleRef} 
          className="info-toggle" 
          onClick={() => setShowInfo(!showInfo)}
          role="button"
          aria-expanded={showInfo}
          aria-label="Mostrar información de la plataforma"
        >
          <i aria-hidden="true">{showInfo ? '▼' : '▶'}</i>
        </div>
      </div>
    </div>
  );
};

export default Login;