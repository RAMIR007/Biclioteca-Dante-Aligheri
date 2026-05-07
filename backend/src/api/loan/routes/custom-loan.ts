export default {
  routes: [
    {
      method: 'POST',
      path: '/loans/:id/renew',
      handler: 'loan.renew',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
