/**
 * Página de Restablecimiento de Contraseña - Sistema de Autenticación HGROUP
 * 
 * Componente para restablecer contraseñas mediante tokens de verificación,
 * con validaciones robustas y feedback visual para el usuario.
 * 
 * NOTA: Este código será refactorizado en futuras iteraciones para mejorar
 * la escalabilidad mediante:
 * - types/: Interfaces TypeScript para datos de formulario y respuestas API
 * - services/: Lógica de API y manejo de tokens
 * - hooks/: Custom hooks para estado y efectos
 * - utils/: Funciones de validación y helpers
 * - components/: Componentes reutilizables (Form, PasswordStrength, etc.)
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import logo from '../../assets/img/H.png'; 
import './ResetPassword.css';

/**
 * Esquema de validación con Zod para el formulario de restablecimiento
 * 
 * Incluye validaciones de:
 * - Longitud mínima de contraseña (8 caracteres)
 * - Presencia de minúsculas, mayúsculas y números
 * - Coincidencia entre contraseña y confirmación
 */
const passwordSchema = z.object({
  newPassword: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[a-z]/, "La contraseña debe contener al menos una minúscula")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

/**
 * Tipo TypeScript inferido del esquema de validación Zod
 */
type FormData = z.infer<typeof passwordSchema>;

/**
 * Componente de Restablecimiento de Contraseña
 * 
 * Maneja la validación de tokens y el proceso de restablecimiento
 * de contraseñas para usuarios que han solicitado recuperación.
 */
const ResetPassword = () => {
  // Hook para obtener parámetros de la URL
  const [searchParams] = useSearchParams();
  
  // Hook para navegación programática
  const navigate = useNavigate();
  
  // Estados de carga y validación
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  
  // Estados para mensajes y datos
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // URL de la API desde variables de entorno
  const API_URL = import.meta.env.VITE_API_URL;

  /**
   * Configuración del formulario con React Hook Form y Zod
   */
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch 
  } = useForm<FormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange' // Validar en cada cambio para feedback inmediato
  });

  // Observar cambios en los campos para validación en tiempo real
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  /**
   * Efecto para obtener y validar token al montar el componente
   */
  useEffect(() => {
    // Obtener token y email de los parámetros de la URL
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');

    // Validar presencia del token
    if (!urlToken) {
      setError('Enlace inválido: falta el token de verificación');
      setIsValidating(false);
      return;
    }

    setToken(urlToken);
    setEmail(urlEmail);

    // Validar el token con la API
    validateToken(urlToken);
  }, [searchParams]);

  /**
   * Valida el token de restablecimiento con la API
   * 
   * @param token - Token de restablecimiento a validar
   */
  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/password/validate-token`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      // Manejar respuestas no exitosas
      if (!response.ok) {
        throw new Error(data.message || 'Token inválido o expirado');
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al validar el enlace');
      
      // Redirigir después de 5 segundos si hay error
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Maneja el envío del formulario de restablecimiento
   * 
   * @param data - Datos del formulario validados
   */
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_URL}/password/reset`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          token, 
          newPassword: data.newPassword,
          email: email || undefined // Email opcional según implementación del backend
        }),
      });

      const responseData = await response.json();

      // Manejar respuestas no exitosas
      if (!response.ok) {
        throw new Error(responseData.message || 'Error al restablecer la contraseña');
      }

      // Mostrar mensaje de éxito
      setSuccess('Contraseña actualizada correctamente. Redirigiendo al login...');
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            success: "Contraseña actualizada correctamente" 
          } 
        });
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Renderizar estado de validación
   */
  if (isValidating) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="brand-header">
            <img src={logo} alt="H Group Logo" className="logo" />
            <h2>Restablecer Contraseña</h2>
          </div>
          <div className="validation-message">
            <div className="loading-spinner"></div>
            <p>Verificando enlace de restablecimiento...</p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Renderizar componente principal
   */
  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        {/* Encabezado de la marca */}
        <div className="brand-header">
          <img src={logo} alt="H Group Logo" className="logo" />
          <h2>Restablecer Contraseña</h2>
        </div>

        {/* Mostrar email si está disponible */}
        {email && (
          <div className="email-notice">
            <p>Restableciendo contraseña para: <strong>{email}</strong></p>
          </div>
        )}

        {/* Mensajes de error */}
        {error && (
          <div className="error-message">
            <span className="message-icon">⚠️</span>
            {error}
            {error.includes('inválido') && (
              <p className="redirect-notice">Serás redirigido al login en unos segundos...</p>
            )}
          </div>
        )}

        {/* Mensajes de éxito */}
        {success && (
          <div className="success-message">
            <span className="message-icon">✅</span>
            {success}
          </div>
        )}

        {/* Formulario de restablecimiento (solo si no hay errores ni éxito) */}
        {!error && !success && (
          <form onSubmit={handleSubmit(onSubmit)} className="reset-password-form">
            {/* Campo de nueva contraseña */}
            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                Nueva Contraseña
              </label>
              <input
                id="newPassword"
                type="password"
                {...register("newPassword")}
                className="form-input"
                placeholder="Ingresa tu nueva contraseña"
                disabled={isLoading}
                autoComplete="new-password"
              />
              {errors.newPassword && (
                <p className="error-text">{errors.newPassword.message}</p>
              )}
              
              {/* Indicador de fortaleza de contraseña */}
              {newPassword && !errors.newPassword && (
                <div className="password-strength">
                  <div className="strength-meter">
                    <div 
                      className={`strength-bar ${newPassword.length >= 8 ? 'active' : ''}`}
                    ></div>
                    <div 
                      className={`strength-bar ${/[a-z]/.test(newPassword) ? 'active' : ''}`}
                    ></div>
                    <div 
                      className={`strength-bar ${/[A-Z]/.test(newPassword) ? 'active' : ''}`}
                    ></div>
                    <div 
                      className={`strength-bar ${/[0-9]/.test(newPassword) ? 'active' : ''}`}
                    ></div>
                  </div>
                  <div className="strength-text">
                    {newPassword.length >= 8 && /[a-z]/.test(newPassword) && 
                     /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) 
                     ? 'Contraseña segura' : 'Requisitos: 8+ caracteres, mayúscula, minúscula, número'}
                  </div>
                </div>
              )}
            </div>

            {/* Campo de confirmación de contraseña */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className="form-input"
                placeholder="Confirma tu nueva contraseña"
                disabled={isLoading}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword.message}</p>
              )}
              
              {/* Indicador de coincidencia de contraseñas */}
              {confirmPassword && newPassword === confirmPassword && !errors.confirmPassword && (
                <p className="success-text">✓ Las contraseñas coinciden</p>
              )}
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? (
                <>
                  <span className="button-spinner"></span>
                  Procesando...
                </>
              ) : (
                'Restablecer Contraseña'
              )}
            </button>
          </form>
        )}

        {/* Enlace para volver al login */}
        <div className="back-to-login">
          <button 
            onClick={() => navigate('/login')} 
            className="back-link"
          >
            ← Volver al Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;