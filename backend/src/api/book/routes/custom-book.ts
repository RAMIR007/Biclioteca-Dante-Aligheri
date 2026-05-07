export default {
  routes: [
    {
      method: 'GET',
      path: '/books/:id/download',
      handler: 'book.download',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/books/bulk-upload',
      handler: 'book.bulkUpload',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ],
};
