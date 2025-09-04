import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import logo from '../../assets/img/H.png'; 
import './ResetPassword.css';

// Esquema de validación con Zod
const schema = z.object({
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

type FormData = z.infer<typeof schema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Obtener token y email de los parámetros de la URL
  useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');

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
          email: email || undefined
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Error al restablecer la contraseña');
      }

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

  // Observar cambios en la contraseña para validación en tiempo real
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

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

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="brand-header">
          <img src={logo} alt="H Group Logo" className="logo" />
          <h2>Restablecer Contraseña</h2>
        </div>

        {email && (
          <div className="email-notice">
            <p>Restableciendo contraseña para: <strong>{email}</strong></p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="message-icon">⚠️</span>
            {error}
            {error.includes('inválido') && (
              <p className="redirect-notice">Serás redirigido al login en unos segundos...</p>
            )}
          </div>
        )}

        {success && (
          <div className="success-message">
            <span className="message-icon">✅</span>
            {success}
          </div>
        )}

        {!error && !success && (
          <form onSubmit={handleSubmit(onSubmit)} className="reset-password-form">
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
              
              {confirmPassword && newPassword === confirmPassword && !errors.confirmPassword && (
                <p className="success-text">✓ Las contraseñas coinciden</p>
              )}
            </div>

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