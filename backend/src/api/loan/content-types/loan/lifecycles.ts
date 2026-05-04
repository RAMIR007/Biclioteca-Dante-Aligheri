import { errors } from '@strapi/utils';
const { ApplicationError } = errors;

export default {
  async beforeCreate(event) {
    const { data } = event.params;
    let bookId = data.book;
    
    // En caso de que venga con formato relacional detallado de Strapi v4
    if (typeof bookId === 'object' && bookId?.connect?.length > 0) {
      bookId = bookId.connect[0].id || bookId.connect[0];
    }

    if (bookId) {
      const book = await strapi.entityService.findOne('api::book.book', bookId);
      if (book && book.status !== 'Available') {
        throw new ApplicationError('El libro no está disponible para reserva.');
      }
    }
  },

  async afterCreate(event) {
    const { result } = event;
    const strapiInstance = strapi;
    
    try {
      // Recargamos el préstamo completo con las relaciones para más seguridad
      const loan = await strapiInstance.entityService.findOne('api::loan.loan', result.id, {
         populate: ['book', 'user']
      });

      if (loan && loan.book) {
        // Al crear un préstamo nuevo, normalmente el estado es Pending, 
        // por tanto reservamos el libro
        await strapiInstance.entityService.update('api::book.book', loan.book.id, {
          data: { status: 'Reserved' }
        });

        // Notificación al usuario
        if (loan.user) {
          await strapiInstance.service('api::loan.notification').sendLoanCreatedNotification(loan.user, loan.book);
        }
      }
    } catch (error) {
      console.error("Error en lifecycle afterCreate de Loan:", error);
    }
  },

  async afterUpdate(event) {
    const { result, data } = event;
    const strapiInstance = strapi;
    
    try {
      // Cuando se cambia el estado del préstamo actualizamos el estado del libro
      if (data.status) {
         const loanId = result.id;
         const loan = await strapiInstance.entityService.findOne('api::loan.loan', loanId, {
            populate: ['book', 'user']
         });

         if (loan && loan.book) {
            let newBookStatus = null;
            if (loan.status === 'Active') {
              newBookStatus = 'Loaned';
            } else if (loan.status === 'Returned' || loan.status === 'Cancelled') {
              newBookStatus = 'Available';
            }

            if (newBookStatus) {
               await strapiInstance.entityService.update('api::book.book', loan.book.id, {
                  data: { status: newBookStatus }
               });
            }

            // Notificación de préstamo vencido
            if (loan.status === 'Overdue' && loan.user) {
               await strapiInstance.service('api::loan.notification').sendEmail({
                 to: loan.user.email,
                 subject: `AVISO: Préstamo Vencido - ${loan.book.title}`,
                 html: `<p>Hola ${loan.user.username}, el libro <strong>${loan.book.title}</strong> debe ser devuelto lo antes posible para evitar sanciones.</p>`
               });
            }
         }
      }
    } catch (error) {
      console.error("Error en lifecycle afterUpdate de Loan:", error);
    }
  },

  async beforeDelete(event) {
     const { params } = event;
     const loanId = params.where?.id;
     if (loanId) {
         try {
           const loan = await strapi.entityService.findOne('api::loan.loan', loanId, {
               populate: ['book']
           });
           event.state = event.state || {};
           event.state.loanToDelete = loan; 
         } catch(e) {
           console.error("Error in beforeDelete", e);
         }
     }
  },

  async afterDelete(event) {
     const loan = event.state?.loanToDelete;
     if (loan && loan.book) {
         // Si se borra el préstamo manualmente en Strapi (Pending, Active, etc.)
         // Devolvemos el libro a estado Available
         if (['Pending', 'Active', 'Overdue'].includes(loan.status)) {
             try {
               await strapi.entityService.update('api::book.book', loan.book.id, {
                 data: { status: 'Available' }
               });
             } catch(e){
                console.error("Error in afterDelete updating book", e);
             }
         }
     }
  }
};
