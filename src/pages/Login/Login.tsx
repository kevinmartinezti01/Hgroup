/**
 * Página de Login - Sistema de Autenticación HGROUP
 * 
 * Componente de inicio de sesión para la plataforma HGROUP con validaciones,
 * manejo de errores y redirección basada en roles.
 * 
 * NOTA: Este código será refactorizado en futuras iteraciones para mejorar
 * la escalabilidad mediante:
 * - types/: Interfaces TypeScript
 * - services/: Lógica de API y autenticación
 * - hooks/: Custom hooks para estado y efectos
 * - utils/: Funciones de validación y helpers
 * - components/: Componentes reutilizables (Form, Input, etc.)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/H.png';

/**
 * Interfaz para los datos del formulario de login
 */
interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Interfaz para los tokens de autenticación
 */
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Interfaz para los datos del usuario
 */
interface UserData {
  id: string;
  name: string;
  email: string;
  role: number;
  dashboardPath: string;
  avatar?: string;
}

/**
 * Interfaz para la respuesta de la API de login
 */
interface LoginResponse {
  tokens: AuthTokens;
  user: UserData;
}

/**
 * Componente de Login - Maneja la autenticación de usuarios
 * 
 * Proporciona un formulario de inicio de sesión con validación de credenciales,
 * manejo de errores y redirección basada en roles.
 */
const Login: React.FC = () => {
  // Estado para mostrar/ocultar panel de información
  const [showInfo, setShowInfo] = useState(false);
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  
  // Estados para mensajes y carga
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs para manejar clicks fuera del panel de información
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const infoToggleRef = useRef<HTMLDivElement>(null);
  
  // Hook de navegación
  const navigate = useNavigate();

  /**
   * Configuración de la URL de la API
   * 
   * Utiliza variable de entorno con fallback a localhost para desarrollo
   */
  const API_URL = import.meta.env.VITE_API_URL;
  if (!API_URL) {
    console.warn('VITE_API_URL no está definida, usando valor por defecto');
  }
  const API_BASE = API_URL || 'http://localhost:3000/api';

  /**
   * Maneja cambios en los campos del formulario
   * 
   * @param e - Evento de cambio del input
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar mensajes cuando el usuario empiece a escribir
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  }, [error, successMessage]);

  /**
   * Valida los datos del formulario
   * 
   * @returns boolean - True si el formulario es válido
   */
  const validateForm = (): boolean => {
    // Validar campos requeridos
    if (!formData.email || !formData.password) {
      setError('Email y contraseña son requeridos');
      return false;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return false;
    }
    
    return true;
  };

  /**
   * Maneja errores de forma centralizada
   * 
   * @param error - Error capturado
   */
  const handleError = (error: unknown) => {
    let errorMessage = 'Error al iniciar sesión';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    setError(errorMessage);
  };

  /**
   * Maneja el envío del formulario de login
   * 
   * @param e - Evento de formulario
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    // Validar formulario antes de enviar
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Realizar petición a la API
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

      // Manejar respuestas no exitosas
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Procesar respuesta exitosa
      const data: LoginResponse = await response.json();

      // Almacenar tokens y datos de usuario en localStorage
      localStorage.setItem('token', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
      localStorage.setItem('userData', JSON.stringify(data.user));

      // Mostrar mensaje de éxito
      setSuccessMessage('¡Autenticación exitosa! Redirigiendo...');

      // Redirigir según el rol del usuario
      setTimeout(() => {
        navigate(data.user.dashboardPath || '/dashboard', { replace: true });
      }, 1500);

    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Efecto para cerrar el panel de información al hacer clic fuera
   */
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
        {/* Encabezado de la marca */}
        <div className="brand-header">
          <img src={logo} alt="H Group Logo" className="logo" />
          <h1>Plataforma HGROUP</h1>
        </div>

        {/* Formulario de login */}
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
              autoFocus
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

          {/* Mensajes de error y éxito */}
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

          {/* Botón de submit */}
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

          {/* Enlace para recuperar contraseña */}
          <div className="form-footer">
            <Link to="/forgot-password" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>

        {/* Pie de página */}
        <div className="login-footer">
          <p>Sistema exclusivo para colaboradores</p>
          <p>v1.0 © 2025</p>
        </div>

        {/* Panel de información (colapsable) */}
        <div ref={infoPanelRef} className={`info-panel ${showInfo ? 'active' : ''}`}>
          <div className="info-content">
            <h2>Información de la Plataforma</h2>
            {/* ... (contenido existente) ... */}
          </div>
        </div>

        {/* Toggle para mostrar/ocultar panel de información */}
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