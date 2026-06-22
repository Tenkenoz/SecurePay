/**
 * NotificationService — Responsabilidad Única: Envío de Notificaciones.
 * 
 * Principio SRP: Este servicio SOLO emite notificaciones (simuladas por consola).
 *                En producción, este módulo se reemplazaría por un cliente de email/SMS
 *                sin afectar ningún otro servicio (Open/Closed Principle).
 */
class NotificationService {
  /**
   * Envía una notificación de débito al emisor de la transferencia.
   * @param {Object} sender - Objeto de cuenta emisora con email, accountAlpha y balance.
   * @param {number} amount - Monto debitado.
   */
  notifyDebit(sender, amount) {
    console.log(`\n--- [EMAIL OUTBOX] Enviando correo de confirmación de débito ---`);
    console.log(`Para: ${sender.email}`);
    console.log(`Asunto: Débito por Transferencia Realizada - Fintech SecurePay`);
    console.log(`Mensaje: Estimado usuario, se ha debitado de su cuenta ${sender.accountAlpha} el valor de $${amount}.`);
    console.log(`Su nuevo saldo disponible es: $${sender.balance}.`);
    console.log(`------------------------------------------------------------\n`);
  }

  /**
   * Envía una notificación de crédito al receptor de la transferencia.
   * @param {Object} receiver - Objeto de cuenta receptora con email, accountAlpha y balance.
   * @param {string} fromAccountId - ID de la cuenta que originó la transferencia.
   * @param {number} amount - Monto acreditado.
   */
  notifyCredit(receiver, fromAccountId, amount) {
    console.log(`\n--- [EMAIL OUTBOX] Enviando correo de recepción de crédito ---`);
    console.log(`Para: ${receiver.email}`);
    console.log(`Asunto: Crédito por Transferencia Recibida - Fintech SecurePay`);
    console.log(`Mensaje: Estimado usuario, ha recibido una transferencia de $${amount} de la cuenta ${fromAccountId}.`);
    console.log(`Su nuevo saldo disponible es: $${receiver.balance}.`);
    console.log(`------------------------------------------------------------\n`);
  }
}

module.exports = NotificationService;
