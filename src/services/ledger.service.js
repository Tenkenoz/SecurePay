/**
 * LedgerService — Responsabilidad Única: Gestión del Libro Contable (Ledger).
 * 
 * Principio SRP: Este servicio SOLO ejecuta movimientos monetarios y persiste registros.
 * Principio DIP: Recibe 'usersDb' y 'transactionsHistory' como dependencias inyectadas.
 */
class LedgerService {
  /**
   * @param {Array} usersDb - Repositorio de cuentas inyectado externamente.
   * @param {Array} transactionsHistory - Historial de transacciones inyectado externamente.
   */
  constructor(usersDb, transactionsHistory) {
    this.usersDb = usersDb;
    this.transactionsHistory = transactionsHistory;
  }

  /**
   * Ejecuta la deducción del emisor y la acreditación al receptor.
   * @param {Object} sender - Cuenta emisora (referencia mutable del array).
   * @param {Object} receiver - Cuenta receptora (referencia mutable del array).
   * @param {number} amount - Monto a transferir.
   */
  applyTransfer(sender, receiver, amount) {
    sender.balance -= amount;
    receiver.balance += amount;
  }

  /**
   * Crea y persiste el registro de la transacción en el historial.
   * @param {string} fromAccountId - ID de la cuenta origen.
   * @param {string} toAccountId - ID de la cuenta destino.
   * @param {number} amount - Monto transferido.
   * @returns {Object} El objeto de transacción recién creado.
   */
  recordTransaction(fromAccountId, toAccountId, amount) {
    const newTransaction = {
      transactionId: `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      from: fromAccountId,
      to: toAccountId,
      amount: amount,
      status: 'COMPLETED',
      timestamp: new Date().toISOString()
    };
    this.transactionsHistory.push(newTransaction);
    return newTransaction;
  }

  /**
   * Obtiene el saldo e información de una cuenta por su ID.
   * @param {string} accountId - ID de la cuenta.
   * @returns {Object} Información de la cuenta.
   * @throws {Error} Si la cuenta no existe.
   */
  getAccountInfo(accountId) {
    const account = this.usersDb.find(u => u.accountAlpha === accountId);
    if (!account) {
      throw new Error(`La cuenta '${accountId}' no existe.`);
    }
    return {
      accountId: account.accountAlpha,
      email: account.email,
      balance: account.balance
    };
  }
}

module.exports = LedgerService;
