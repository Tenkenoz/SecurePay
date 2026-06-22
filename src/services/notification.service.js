// NotificationService — Solo emite notificaciones (simulación de email por consola) (SRP)
class NotificationService {
  // Notifica al emisor sobre el débito realizado
  notifyDebit(sender, amount) {
    console.log(`\n--- [EMAIL OUTBOX] Correo de débito ---`);
    console.log(`Para: ${sender.email}`);
    console.log(`Asunto: Débito por Transferencia Realizada - Fintech SecurePay`);
    console.log(`Mensaje: Se ha debitado $${amount} de su cuenta ${sender.accountAlpha}.`);
    console.log(`Saldo actual: $${sender.balance}.`);
    console.log(`--------------------------------------\n`);
  }

  // Notifica al receptor sobre el crédito recibido
  notifyCredit(receiver, fromAccountId, amount) {
    console.log(`\n--- [EMAIL OUTBOX] Correo de crédito ---`);
    console.log(`Para: ${receiver.email}`);
    console.log(`Asunto: Crédito por Transferencia Recibida - Fintech SecurePay`);
    console.log(`Mensaje: Ha recibido $${amount} de la cuenta ${fromAccountId}.`);
    console.log(`Saldo actual: $${receiver.balance}.`);
    console.log(`---------------------------------------\n`);
  }
}

module.exports = NotificationService;
