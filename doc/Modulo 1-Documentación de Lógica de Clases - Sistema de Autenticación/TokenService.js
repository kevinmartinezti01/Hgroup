/**
 * Servicio de Tokens - Verificación y decodificación de tokens JWT
 */
class TokenService {
  /**
   * Verifica validez de token JWT
   * @param {string} token - Token JWT
   * @returns {Object} Payload decodificado
   * @throws {UnauthorizedError} Si token es inválido o expirado
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, jwtSecret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token expirado');
      }
      throw new UnauthorizedError('Token inválido');
    }
  }

  /**
   * Decodifica token JWT sin verificar
   * @param {string} token - Token JWT
   * @returns {Object} Payload decodificado
   */
  static decodeToken(token) { /* implementación */ }
}