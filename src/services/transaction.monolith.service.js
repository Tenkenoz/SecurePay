const ValidationService = require('./validation.service');
const LedgerService = require('./ledger.service');
const NotificationService = require('./notification.service');

// Simulación de base de datos en memoria
const usersDb = [
  { id: 'usr_001', email: 'estudiante.alpha@espe.edu.ec', accountAlpha: 'ACC-12345', balance: 1500.00 },
  { id: 'usr_002', email: 'docente.beta@espe.edu.ec', accountAlpha: 'ACC-67890', balance: 350.50 }
];

const transactionsHistory = [];

// TransactionService — Orquestador de transferencias (SRP + DIP)
// Delega cada responsabilidad a su servicio especializado
// Las dependencias se inyectan por constructor (no se instancian aquí)
class TransactionService {
  constructor(validationService, ledgerService, notificationService) {
    this.validationService = validationService;
    this.ledgerService = ledgerService;
    this.notificationService = notificationService;
  }

  // Orquesta el flujo completo de una transferencia bancaria
  executeTransfer(fromAccountId, toAccountId, amount) {
    // Validar cuentas y monto
    const sender = this.validationService.validateSenderAccount(fromAccountId);
    const receiver = this.validationService.validateReceiverAccount(toAccountId);
    this.validationService.validateTransferAmount(sender, amount);

    // Ejecutar movimiento contable y registrar transacción
    this.ledgerService.applyTransfer(sender, receiver, amount);
    const newTransaction = this.ledgerService.recordTransaction(fromAccountId, toAccountId, amount);

    // Notificar a emisor y receptor
    this.notificationService.notifyDebit(sender, amount);
    this.notificationService.notifyCredit(receiver, fromAccountId, amount);

    return {
      success: true,
      message: 'Transferencia ejecutada con éxito',
      transaction: newTransaction,
      balanceRestante: sender.balance
    };
  }

  // Obtiene el saldo de una cuenta
  getAccountBalance(accountId) {
    return this.ledgerService.getAccountInfo(accountId);
  }
}

// Composition Root: construir e inyectar dependencias
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
