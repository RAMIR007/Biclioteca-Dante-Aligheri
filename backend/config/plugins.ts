export default ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {
          folder: 'biblioteca_dante',
        },
        uploadStream: {
          folder: 'biblioteca_dante',
        },
        delete: {},
      },
    },
  },
  // Habilitamos nuestro servicio de envíos en Strapi (opcional, en plugins de terceros, pero nosotros lo hicimos directo en el modelo)
});
