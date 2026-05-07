import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::loan.loan', ({ strapi }) => ({
  async renew(ctx) {
    const { id } = ctx.params;
    
    // Fetch the loan with its associated book
    const loan = await strapi.entityService.findOne('api::loan.loan', id, {
      populate: ['book'],
    });

    if (!loan) {
      return ctx.notFound('Préstamo no encontrado');
    }

    if (loan.status === 'Overdue') {
      return ctx.badRequest('No se puede renovar un préstamo vencido.');
    }
    
    if (loan.status !== 'Active') {
      return ctx.badRequest('Solo se pueden renovar préstamos activos.');
    }

    // Check if the book exists and its status
    const loanWithBook = loan as any;
    if (loanWithBook.book && loanWithBook.book.status === 'Reserved') {
      return ctx.badRequest('No se puede renovar porque el libro ha sido reservado por otro estudiante.');
    }

    // Add 7 days to the current returnDate
    const currentReturnDate = new Date(loan.returnDate);
    const newReturnDate = new Date(currentReturnDate);
    newReturnDate.setDate(newReturnDate.getDate() + 7);

    // Update the loan
    const updatedLoan = await strapi.entityService.update('api::loan.loan', id, {
      data: {
        returnDate: newReturnDate.toISOString().split('T')[0], // format to YYYY-MM-DD
      },
    });

    return ctx.send({ data: updatedLoan, message: 'Renovación exitosa por 7 días más.' });
  }
}));
