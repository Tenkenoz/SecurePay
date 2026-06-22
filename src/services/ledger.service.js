/**
 * LedgerService — Responsabilidad Única: Gestión del Libro Contable (Ledger).
 * Principio SRP, Principio DIP
 */
class LedgerService {
  constructor(usersDb, transactionsHistory) {
    this.usersDb = usersDb;
    this.transactionsHistory = transactionsHistory;
  }

  //Ejecuta la deducción del emisor y la acreditación al receptor.
  applyTransfer(sender, receiver, amount) {
    sender.balance -= amount;
    receiver.balance += amount;
  }


  // Crea y persiste el registro de la transacción en el historial.
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


  //Obtiene el saldo e información de una cuenta por su ID.
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
