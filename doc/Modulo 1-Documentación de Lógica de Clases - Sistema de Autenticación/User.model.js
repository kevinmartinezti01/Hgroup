/**
 * Modelo de Usuario - Gestiona la entidad usuario en la base de datos
 */
class User {
  constructor({ id, uuid, name, email, password, role_id, is_active, created_at, updated_at, last_login, failed_login_attempts, last_failed_login }) {
    this.id = id;
    this.uuid = uuid;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role_id = role_id;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.last_login = last_login;
    this.failed_login_attempts = failed_login_attempts;
    this.last_failed_login = last_failed_login;
  }

  /**
   * Busca usuario por email
   * @param {string} email - Email del usuario
   * @returns {Promise<User>} Instancia de User
   */
  static async findByEmail(email) { /* implementación */ }

  /**
   * Busca usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<User>} Instancia de User
   */
  static async findById(id) { /* implementación */ }

  /**
   * Actualiza información de login
   * @param {number} id - ID del usuario
   * @param {string} ip - Dirección IP
   */
  static async updateLoginInfo(id, ip) { /* implementación */ }

  /**
   * Incrementa intentos fallidos de login
   * @param {number} id - ID del usuario
   * @param {string} ip - Dirección IP
   */
  static async incrementFailedAttempts(id, ip) { /* implementación */ }

  /**
   * Actualiza contraseña del usuario
   * @param {number} id - ID del usuario
   * @param {string} hashedPassword - Contraseña hasheada
   * @param {string} ip - Dirección IP
   */
  static async updatePassword(id, hashedPassword, ip) { /* implementación */ }
}