export default {
  // Check every day at midnight (or '* * * * *' for every minute in testing)
  // For production usually '0 0 * * *'
  '0 0 * * *': async ({ strapi }) => {
    console.log('Running Overdue Loans check cron job...');
    try {
      const now = new Date();
      // Find all loans that are currently Active and returnDate is in the past
      const overdueLoans = await strapi.entityService.findMany('api::loan.loan', {
        filters: {
          status: 'Active',
          returnDate: {
            $lt: now.toISOString().split('T')[0], // Comparing YYYY-MM-DD
          },
        },
      });

      if (overdueLoans && overdueLoans.length > 0) {
        console.log(`Found ${overdueLoans.length} loans to mark as Overdue.`);
        for (const loan of overdueLoans) {
          // Updating the status to Overdue
          // This will automatically trigger the afterUpdate lifecycle which sends the notification
          await strapi.entityService.update('api::loan.loan', loan.id, {
            data: {
              status: 'Overdue',
            },
          });
        }
      } else {
         console.log('No overdue loans found today.');
      }
    } catch (err) {
      console.error('Error running Overdue Loans cron job:', err);
    }
  },
};
