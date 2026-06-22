// ValidationService — Solo valida reglas de negocio financiero (SRP)
// Recibe usersDb como dependencia inyectada (DIP)
class ValidationService {
  constructor(usersDb) {
    this.usersDb = usersDb;
  }

  // Verifica que la cuenta origen exista
  validateSenderAccount(accountId) {
    const sender = this.usersDb.find(u => u.accountAlpha === accountId);
    if (!sender) {
      throw new Error(`Error de validación: La cuenta origen '${accountId}' no existe en la base de datos.`);
    }
    return sender;
  }

  // Verifica que la cuenta destino exista
  validateReceiverAccount(accountId) {
    const receiver = this.usersDb.find(u => u.accountAlpha === accountId);
    if (!receiver) {
      throw new Error(`Error de validación: La cuenta destino '${accountId}' no existe en la base de datos.`);
    }
    return receiver;
  }

  // Verifica que el monto sea positivo y el saldo sea suficiente
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
