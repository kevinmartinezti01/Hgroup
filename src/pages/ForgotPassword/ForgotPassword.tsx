import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';
import logo from '../../assets/img/H.png';

const schema = z.object({
  email: z.string().email("Por favor, introduce un correo electrónico válido."),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/password/request-reset`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: data.email 
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada y la carpeta de spam.');
      } else {
        // Para seguridad, mostramos un mensaje genérico incluso si el email no existe
        setMessage('Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.');
        console.error('Error del servidor:', responseData.message);
      }
    } catch (err) {
      setError('Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.');
      console.error('Error en la solicitud:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="brand-header">
          <img src={logo} alt="H Group Logo" className="logo" />
          <h2>¿Olvidaste tu Contraseña?</h2>
        </div>

        <p className="instruction-text">
          Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {message && (
          <div className="success-message">
            <span className="message-icon">✓</span>
            {message}
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <span className="message-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="form-input"
              placeholder="tu.email@ejemplo.com"
              disabled={isLoading}
            />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="submit-button"
          >
            {isLoading ? (
              <>
                <span className="button-spinner"></span>
                Enviando...
              </>
            ) : (
              'Enviar Enlace de Restablecimiento'
            )}
          </button>
        </form>
        
        <div className="back-to-login">
          <Link to="/login" className="back-link">
            ← Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;