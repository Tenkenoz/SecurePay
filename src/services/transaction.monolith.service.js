/**
 * TransactionService — Orquestador de Transferencias Financieras.
 * 
 * Refactorizado aplicando principios SOLID:
 * 
 * SRP (Single Responsibility Principle):
 *   La lógica previamente monolítica ha sido segregada en servicios especializados:
 *   - ValidationService: valida cuentas y montos.
 *   - LedgerService: ejecuta movimientos contables y persiste registros.
 *   - NotificationService: emite notificaciones al emisor y receptor.
 * 
 * DIP (Dependency Inversion Principle):
 *   Este controlador NO instancia sus dependencias internamente. Los servicios de bajo
 *   nivel son inyectados a través del constructor, permitiendo sustituirlos por mocks
 *   o implementaciones alternativas sin modificar este módulo.
 */

const ValidationService = require('./validation.service');
const LedgerService = require('./ledger.service');
const NotificationService = require('./notification.service');

// --- Estado compartido (simulación de base de datos en memoria) ---
const usersDb = [
  { id: 'usr_001', email: 'estudiante.alpha@espe.edu.ec', accountAlpha: 'ACC-12345', balance: 1500.00 },
  { id: 'usr_002', email: 'docente.beta@espe.edu.ec', accountAlpha: 'ACC-67890', balance: 350.50 }
];

const transactionsHistory = [];

/**
 * Clase orquestadora que coordina las operaciones de transferencia bancaria.
 * Las dependencias son inyectadas por constructor (DIP).
 */
class TransactionService {
  /**
   * @param {ValidationService} validationService - Servicio de validación de reglas de negocio.
   * @param {LedgerService} ledgerService - Servicio de gestión contable y persistencia.
   * @param {NotificationService} notificationService - Servicio de notificaciones.
   */
  constructor(validationService, ledgerService, notificationService) {
    this.validationService = validationService;
    this.ledgerService = ledgerService;
    this.notificationService = notificationService;
  }

  /**
   * Orquesta el flujo completo de una transferencia bancaria delegando
   * cada responsabilidad al servicio especializado correspondiente.
   * 
   * @param {string} fromAccountId - ID de la cuenta origen.
   * @param {string} toAccountId - ID de la cuenta destino.
   * @param {number} amount - Monto a transferir.
   * @returns {Object} Resultado de la transacción.
   */
  executeTransfer(fromAccountId, toAccountId, amount) {
    // Delegar validación al ValidationService (SRP)
    const sender = this.validationService.validateSenderAccount(fromAccountId);
    const receiver = this.validationService.validateReceiverAccount(toAccountId);
    this.validationService.validateTransferAmount(sender, amount);

    // Delegar movimiento contable al LedgerService (SRP)
    this.ledgerService.applyTransfer(sender, receiver, amount);
    const newTransaction = this.ledgerService.recordTransaction(fromAccountId, toAccountId, amount);

    // Delegar notificaciones al NotificationService (SRP)
    this.notificationService.notifyDebit(sender, amount);
    this.notificationService.notifyCredit(receiver, fromAccountId, amount);

    return {
      success: true,
      message: 'Transferencia ejecutada con éxito',
      transaction: newTransaction,
      balanceRestante: sender.balance
    };
  }

  /**
   * Obtiene el saldo actual de una cuenta, delegando al LedgerService.
   * @param {string} accountId - ID de la cuenta a consultar.
   * @returns {Object} Información de saldo de la cuenta.
   */
  getAccountBalance(accountId) {
    return this.ledgerService.getAccountInfo(accountId);
  }
}

// --- Composición de dependencias (Composition Root) ---
// Las dependencias concretas se construyen aquí y se inyectan al orquestador.
const validationService = new ValidationService(usersDb);
const ledgerService = new LedgerService(usersDb, transactionsHistory);
const notificationService = new NotificationService();

const transactionServiceInstance = new TransactionService(
  validationService,
  ledgerService,
  notificationService
);

module.exports = {
  executeTransfer: (from, to, amount) => transactionServiceInstance.executeTransfer(from, to, amount),
  getAccountBalance: (accountId) => transactionServiceInstance.getAccountBalance(accountId),
  usersDb,
  transactionsHistory
};
