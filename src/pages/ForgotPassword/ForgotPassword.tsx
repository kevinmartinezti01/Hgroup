/**
 * Página de Recuperación de Contraseña - Sistema de Autenticación HGROUP
 * 
 * Componente para solicitar restablecimiento de contraseñas mediante envío de email
 * con tokens de verificación. Implementa medidas de seguridad para evitar
 * la enumeración de usuarios y proporciona feedback adecuado al usuario.
 * 
 * NOTA: Este código será refactorizado en futuras iteraciones para mejorar
 * la escalabilidad mediante:
 * - types/: Interfaces TypeScript para datos de formulario y respuestas API
 * - services/: Lógica de API y manejo de solicitudes
 * - hooks/: Custom hooks para estado y efectos
 * - utils/: Funciones de validación y helpers
 * - components/: Componentes reutilizables (Form, Input, etc.)
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';
import logo from '../../assets/img/H.png';

/**
 * Esquema de validación con Zod para el formulario de recuperación
 * 
 * Valida que el campo email tenga un formato válido para evitar
 * solicitudes malformadas a la API.
 */
const emailSchema = z.object({
  email: z.string().email("Por favor, introduce un correo electrónico válido."),
});

/**
 * Tipo TypeScript inferido del esquema de validación Zod
 */
type FormData = z.infer<typeof emailSchema>;

/**
 * Componente de Recuperación de Contraseña
 * 
 * Maneja el proceso de solicitud de restablecimiento de contraseña
 * mediante el envío de emails con enlaces de verificación.
 * Implementa medidas de seguridad para evitar fuga de información.
 */
const ForgotPassword = () => {
  // Estados de carga y mensajes
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Configuración del formulario con React Hook Form y Zod
   * 
   * Utiliza el resolver de Zod para validaciones y maneja
   * el estado del formulario de manera eficiente.
   */
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormData>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange' // Validar en cada cambio para feedback inmediato
  });

  // URL de la API desde variables de entorno
  const API_URL = import.meta.env.VITE_API_URL;

  /**
   * Maneja el envío del formulario de recuperación
   * 
   * @param data - Datos del formulario validados
   */
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Realizar petición a la API para solicitar restablecimiento
      const response = await fetch(`${API_URL}/password/request-reset`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: data.email 
        })
      });

      const responseData = await response.json();

      // Manejar respuesta exitosa
      if (response.ok) {
        setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada y la carpeta de spam.');
      } else {
        /**
         * Por seguridad, mostramos un mensaje genérico incluso si el email no existe
         * Esto previene la enumeración de usuarios mediante timing attacks
         */
        setMessage('Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.');
        console.error('Error del servidor:', responseData.message);
      }
    } catch (err) {
      // Manejar errores de conexión
      setError('Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.');
      console.error('Error en la solicitud:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Renderizar componente
   */
  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        {/* Encabezado de la marca */}
        <div className="brand-header">
          <img src={logo} alt="H Group Logo" className="logo" />
          <h2>¿Olvidaste tu Contraseña?</h2>
        </div>

        {/* Instrucciones para el usuario */}
        <p className="instruction-text">
          Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {/* Mensaje de éxito (genérico por seguridad) */}
        {message && (
          <div className="success-message">
            <span className="message-icon">✓</span>
            {message}
          </div>
        )}
        
        {/* Mensaje de error (solo para errores de conexión) */}
        {error && (
          <div className="error-message">
            <span className="message-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Formulario de recuperación */}
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
              autoComplete="email"
              autoFocus
            />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>

          {/* Botón de envío */}
          <button 
            type="submit" 
            disabled={isLoading} 
            className="submit-button"
            aria-busy={isLoading}
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
        
        {/* Enlace para volver al login */}
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