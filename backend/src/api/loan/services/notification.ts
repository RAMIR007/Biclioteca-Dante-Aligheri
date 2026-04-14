/**
 * Servicio de Notificaciones: Coordina Emails y WhatsApp
 */

export default () => ({
  async sendLoanCreatedNotification(user, book) {
    console.log(`Enviando notificación de reserva a: ${user.email} y WA: ${user.phoneNumber}`);
    
    // 1. Enviar Email vía Resend
    await this.sendEmail({
      to: user.email,
      subject: `Reserva Confirmada: ${book.title}`,
      html: `
        <h2>¡Hola ${user.username || 'Estudiante'}!</h2>
        <p>Tu solicitud para el libro <strong>"${book.title}"</strong> ha sido registrada exitosamente.</p>
        <p>Tienes <strong>3 días hábiles</strong> para pasar a recogerlo por la biblioteca de la Dante Alighieri.</p>
        <p>¡Gracias por leer y practicar tu italiano!</p>
      `
    });

    // 2. Enviar WhatsApp (Si el usuario habilitó WhatsApp y tiene número)
    if (user.whatsappEnabled && user.phoneNumber) {
      await this.sendWhatsApp(
        user.phoneNumber,
        `📚 *Dante Alighieri Biblioteca*\n\n¡Hola! Tu reserva del libro *"${book.title}"* está lista. Puedes pasar a recogerlo en la escuela. ¡A presto!`
      );
    }
  },

  async sendEmail(payload) {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("No RESEND_API_KEY config. Skipping email.");
      return;
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Biblioteca Dante <biblioteca@tudominio.com>', // Requiere verificación en Resend
          to: [payload.to],
          subject: payload.subject,
          html: payload.html
        })
      });
      const data = await response.json();
      console.log('Resend Response:', data);
    } catch (error) {
      console.error('Error al enviar email:', error);
    }
  },

  async sendWhatsApp(phoneNumber, message) {
    const waToken = process.env.WHATSAPP_TOKEN;
    const waPhoneId = process.env.WHATSAPP_PHONE_ID;
    
    if (!waToken || !waPhoneId) {
      console.warn("No WhatsApp config. Skipping WA message.");
      return;
    }

    try {
      // Usar Graph API v17+ para WhatsApp Cloud API
      const response = await fetch(`https://graph.facebook.com/v17.0/${waPhoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${waToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phoneNumber, // Ej: +535XXXXXXX
          type: "text",
          text: {
            body: message
          }
        })
      });
      const data = await response.json();
      console.log('WhatsApp API Response:', data);
    } catch (error) {
      console.error('Error al enviar WhatsApp:', error);
    }
  }
});
