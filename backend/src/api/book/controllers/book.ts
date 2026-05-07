import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::book.book', ({ strapi }) => ({
  async download(ctx) {
    const { id } = ctx.params;
    
    // Buscar el libro con su archivo digital
    const book = await strapi.entityService.findOne('api::book.book', id, {
      populate: ['digitalFile'],
    });

    if (!book || !book.digitalFile) {
      return ctx.notFound('El libro o el archivo digital no existen.');
    }

    // Extraer datos del request para la estadística
    const ipAddress = ctx.request.ip || ctx.request.ips[0] || 'Unknown';
    const userAgent = ctx.request.header['user-agent'] || 'Unknown';
    let country = 'Unknown';

    // Opcional: Llamada básica a API gratuita de geoIP (sin clave, para propósitos de prueba)
    try {
      if (ipAddress && ipAddress !== 'Unknown' && ipAddress !== '127.0.0.1' && ipAddress !== '::1') {
        const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
        const geoData = await response.json();
        if (geoData.status === 'success') {
          country = geoData.country;
        }
      } else {
        country = 'Localhost';
      }
    } catch (e) {
      console.warn('No se pudo geolocalizar la IP');
    }

    // Crear registro de estadística
    await strapi.entityService.create('api::download-stat.download-stat', {
      data: {
        ipAddress,
        country,
        userAgent,
        book: id,
        publishedAt: new Date(), // Necesario en Strapi v4/v5 si no está deshabilitado el draftAndPublish (aunque lo deshabilitamos, es buena práctica)
      },
    });

    // Actualizar contador del libro
    const newCount = (book.totalDownloads || 0) + 1;
    await strapi.entityService.update('api::book.book', id, {
      data: {
        totalDownloads: newCount,
      },
    });

    // Redirigir a la URL del archivo
    ctx.redirect(book.digitalFile.url);
  },

  async bulkUpload(ctx) {
    const files = ctx.request.files && (ctx.request.files as any).files;
    if (!files) {
      return ctx.badRequest('No files uploaded');
    }

    const filesArray = Array.isArray(files) ? files : [files];
    const results = [];

    for (const f of filesArray) {
      const file = f as any;
      try {
        // 1. Subir archivo a la Media Library de Strapi
        const uploadedFiles = await strapi.plugin('upload').service('upload').upload({
          data: {},
          files: file,
        });
        const uploadedFile = uploadedFiles[0];

        // 2. Extraer nombre limpio
        const rawName = file.name || file.originalFilename || 'unknown';
        const cleanName = rawName
          .replace(/\.[^/.]+$/, "") 
          .replace(/[_-]/g, " ") 
          .trim();

        // 3. Consultar Google Books API
        let bookData: any = {
          title: cleanName,
          author: "Autor Desconocido",
          description: "Sin descripción",
          isbn: "",
          language: "Italian", 
          level: "A1", 
          format: "Digital",
          status: "Available",
          digitalFile: uploadedFile.id,
        };

        const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(cleanName)}&maxResults=1`;
        const response = await fetch(googleBooksUrl);
        const data = await response.json() as any;

        if (data.items && data.items.length > 0) {
          const volumeInfo = data.items[0].volumeInfo;
          
          if (volumeInfo.title) bookData.title = volumeInfo.title;
          if (volumeInfo.authors && volumeInfo.authors.length > 0) bookData.author = volumeInfo.authors.join(", ");
          if (volumeInfo.description) bookData.description = volumeInfo.description;
          if (volumeInfo.language) {
            if (volumeInfo.language.includes('es')) bookData.language = "Spanish";
            else if (volumeInfo.language.includes('it')) bookData.language = "Italian";
            else bookData.language = "Bilingual";
          }
          if (volumeInfo.industryIdentifiers) {
            const isbn = volumeInfo.industryIdentifiers.find((id: any) => id.type === 'ISBN_13' || id.type === 'ISBN_10');
            if (isbn) bookData.isbn = isbn.identifier;
          }
        }

        // 4. Crear el libro en Strapi
        const newBook = await strapi.entityService.create('api::book.book' as any, {
          data: bookData,
        });

        results.push({ success: true, file: rawName, book: newBook });

      } catch (err: any) {
        console.error(`Error processing file ${file.name || 'unknown'}:`, err);
        results.push({ success: false, file: file.name, error: err.message });
      }
    }

    return ctx.send({ data: results });
  }
}));
