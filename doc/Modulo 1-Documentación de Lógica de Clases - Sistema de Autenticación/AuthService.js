/**
 * Servicio de Autenticación - Lógica principal de login, registro y gestión de sesiones
 */
class AuthService {
  // Mapa de roles (ID → Nombre)
  static ROLES = {
    1: 'admin',
    2: 'head', 
    3: 'user'
  };

  /**
   * Autentica usuario y genera tokens
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @param {string} ip - Dirección IP
   * @param {string} userAgent - User Agent del cliente
   * @returns {Promise<Object>} { user, tokens }
   */
  static async login(email, password, ip, userAgent) {
    // 1. Validar usuario y contraseña
    // 2. Verificar intentos fallidos
    // 3. Generar tokens JWT
    // 4. Registrar actividad
    // 5. Retornar respuesta
  }

  /**
   * Refresca token de acceso
   * @param {string} refreshToken - Token de refresh
   * @param {string} ip - Dirección IP
   * @param {string} userAgent - User Agent del cliente
   * @returns {Promise<Object>} { accessToken, refreshToken }
   */
  static async refreshToken(refreshToken, ip, userAgent) { /* implementación */ }

  /**
   * Verifica acceso a rol específico
   * @param {number} userId - ID del usuario
   * @param {number} requiredRoleId - ID del rol requerido
   * @returns {Promise<boolean>} true si tiene acceso
   */
  static async verifyRoleAccess(userId, requiredRoleId) { /* implementación */ }

  /**
   * Genera token de acceso JWT
   * @param {Object} user - Objeto usuario
   * @returns {string} Token JWT
   */
  static generateAccessToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role_id
    };
    return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration });
  }
}