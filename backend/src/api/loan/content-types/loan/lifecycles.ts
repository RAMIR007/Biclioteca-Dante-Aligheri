export default {
  async afterCreate(event) {
    const { result, data } = event;
    
    // Obtenemos los servicios de Strapi
    const strapiInstance = strapi;
    
    try {
      // data.user y data.book normalmente traen solo IDs en afterCreate, 
      // así que necesitamos consultar el DB completo para traer email, title, y teléfono
      const userId = data.user;
      const bookId = data.book;

      if (!userId || !bookId) return;

      const user = await strapiInstance.entityService.findOne('plugin::users-permissions.user', userId);
      const book = await strapiInstance.entityService.findOne('api::book.book', bookId);

      if (user && book) {
        // Llamamos a nuestro servicio de notificaciones personalizado
        await strapiInstance.service('api::loan.notification').sendLoanCreatedNotification(user, book);
      }
    } catch (error) {
      console.error("Error en lifecycle afterCreate de Loan:", error);
    }
  },

  async afterUpdate(event) {
    const { result, data } = event;
    const strapiInstance = strapi;
    
    try {
      if (data.status === 'Overdue') {
        const userId = data.user;
        const bookId = data.book;
        if (!userId || !bookId) return;

        const user = await strapiInstance.entityService.findOne('plugin::users-permissions.user', userId);
        const book = await strapiInstance.entityService.findOne('api::book.book', bookId);

        if (user && book) {
          // Enviar alerta de vencimiento
          await strapiInstance.service('api::loan.notification').sendEmail({
            to: user.email,
            subject: `AVISO: Préstamo Vencido - ${book.title}`,
            html: `<p>Hola ${user.username}, el libro <strong>${book.title}</strong> debe ser devuelto lo antes posible para evitar sanciones.</p>`
          });
        }
      }
    } catch (error) {
      console.error("Error en lifecycle afterUpdate de Loan:", error);
    }
  }
};
