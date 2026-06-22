/**
 * ValidationService — Responsabilidad Única: Validación de Reglas de Negocio Financiero.
 * 
 * Principio SRP: Este servicio SOLO valida; no escribe ni notifica.
 * Principio DIP: Recibe 'usersDb' como dependencia inyectada (abstracción), 
 *                no lo instancia directamente.
 */
class ValidationService {
  /**
   * @param {Array} usersDb - Repositorio de usuarios inyectado externamente.
   */
  constructor(usersDb) {
    this.usersDb = usersDb;
  }

  /**
   * Verifica que la cuenta origen exista en la base de datos.
   * @param {string} accountId
   * @returns {Object} El objeto de usuario encontrado.
   * @throws {Error} Si la cuenta no existe.
   */
  validateSenderAccount(accountId) {
    const sender = this.usersDb.find(u => u.accountAlpha === accountId);
    if (!sender) {
      throw new Error(`Error de validación: La cuenta origen '${accountId}' no existe en la base de datos.`);
    }
    return sender;
  }

  /**
   * Verifica que la cuenta destino exista en la base de datos.
   * @param {string} accountId
   * @returns {Object} El objeto de usuario encontrado.
   * @throws {Error} Si la cuenta no existe.
   */
  validateReceiverAccount(accountId) {
    const receiver = this.usersDb.find(u => u.accountAlpha === accountId);
    if (!receiver) {
      throw new Error(`Error de validación: La cuenta destino '${accountId}' no existe en la base de datos.`);
    }
    return receiver;
  }

  /**
   * Verifica que el monto sea positivo y que el emisor tenga saldo suficiente.
   * @param {Object} sender - Cuenta emisora.
   * @param {number} amount - Monto de la transferencia.
   * @throws {Error} Si el monto es inválido o el saldo es insuficiente.
   */
  validateTransferAmount(sender, amount) {
    if (amount <= 0) {
      throw new Error('Error de validación: El monto a transferir debe ser mayor a cero.');
    }
    if (sender.balance < amount) {
      throw new Error(
        `Saldo insuficiente: La cuenta '${sender.accountAlpha}' tiene $${sender.balance}, requiere $${amount}.`
      );
    }
  }
}

module.exports = ValidationService;
