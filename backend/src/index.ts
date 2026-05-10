// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  async bootstrap({ strapi }/* : { strapi: Core.Strapi } */) {
    try {
      // Find the Public role
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (publicRole) {
        // Define the permissions we want to grant
        const permissions = ['api::book.book.find', 'api::book.book.findOne'];

        for (const action of permissions) {
          // Check if the permission already exists
          const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
            where: { action, role: publicRole.id },
          });

          // Create the permission if it doesn't exist
          if (!existingPermission) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                action,
                role: publicRole.id,
              },
            });
            console.log(`Granted ${action} permission to Public role`);
          }
        }
      }
    } catch (error) {
      console.error('Error setting up initial permissions:', error);
    }
  },
};
