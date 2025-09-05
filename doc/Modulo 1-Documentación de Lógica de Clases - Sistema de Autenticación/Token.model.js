/**
 * Modelo de Token - Gestiona tokens de refresh y reset de password
 */
class Token {
  /**
   * Crea token de refresh
   * @param {number} userId - ID del usuario
   * @param {string} token - Token string
   * @param {Date} expiresAt - Fecha de expiración
   * @param {string} ip - Dirección IP
   */
  static async createRefreshToken(userId, token, expiresAt, ip) { /* implementación */ }

  /**
   * Busca token de refresh
   * @param {string} token - Token string
   * @returns {Promise<Token>} Instancia de Token
   */
  static async findRefreshToken(token) { /* implementación */ }

  /**
   * Revoca token de refresh
   * @param {string} token - Token a revocar
   * @param {string} ip - Dirección IP
   * @param {string} newToken - Nuevo token (opcional)
   */
  static async revokeRefreshToken(token, ip, newToken) { /* implementación */ }

  /**
   * Crea token de reset de password
   * @param {number} userId - ID del usuario
   * @param {string} token - Token string
   * @param {Date} expiresAt - Fecha de expiración
   * @param {string} ip - Dirección IP
   */
  static async createPasswordResetToken(userId, token, expiresAt, ip) { /* implementación */ }
}