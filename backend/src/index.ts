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

      // Seed Manual Content
      const spanishManual = `
# Manual de Administración - Biblioteca Dante Alighieri

Bienvenido al manual oficial de gestión de la Biblioteca Digital Dante Alighieri. Este documento está diseñado para guiar a los bibliotecarios y administradores en el uso diario del sistema.

## 1. Acceso al Sistema

El sistema está dividido en dos partes:
*   **Frontend (Portal Público):** Donde los estudiantes exploran los libros y hacen reservaciones.
*   **Panel de Administración (Strapi):** El centro de control privado donde los bibliotecarios gestionan el inventario, los préstamos y los usuarios.

Para acceder al Panel de Administración, ingresa a tu-dominio.com/admin (o http://localhost:1337/admin en desarrollo) e inicia sesión con tus credenciales de administrador.

> [!TIP]
> **Cambiar el Idioma a Español:**
> 1. Haz clic en tus iniciales en la esquina inferior izquierda.
> 2. Selecciona **Profile** (Perfil).
> 3. En **Interface language**, elige **Español** y haz clic en Guardar.

---

## 2. Gestión del Catálogo (Libros)

En el menú lateral izquierdo, bajo la sección **Content Manager (Gestor de Contenido)**, encontrarás la colección **Books (Libros)**.

### Agregar un nuevo libro
1. Haz clic en **Create new entry** (Crear nueva entrada).
2. Completa los campos obligatorios:
    *   **Título** y **Autor**.
    *   **Idioma:** Italiano, Bilingüe, etc.
    *   **Nivel:** A1, A2, B1, B2, C1, C2.
    *   **Estado:** Marca siempre como 'Available' (Disponible) al crearlo.
3. **Portada (Cover):** Haz clic para subir la imagen. Gracias a la integración con Cloudinary, la imagen se optimizará y guardará en la nube automáticamente.
4. Haz clic en **Save** (Guardar) y luego en **Publish** (Publicar) para que los estudiantes puedan verlo.

---

## 3. Gestión de Préstamos y Reservas

El corazón de la biblioteca es la colección **Loans (Préstamos)**. Aquí verás todas las interacciones de los estudiantes con los libros.

### Ciclo de vida de un préstamo:
1. **Reserva (Reserved):** Un estudiante solicita un libro desde la página web. El sistema crea un registro con estado 'Reserved'. El libro cambia automáticamente su estado a 'Reserved' para que nadie más pueda pedirlo.
2. **Préstamo Activo (Loaned):** Cuando el estudiante recoge el libro físicamente en la biblioteca:
    *   El bibliotecario abre el registro de reserva.
    *   Cambia el estado a 'Loaned'.
    *   Define la fecha de devolución (dueDate).
3. **Devolución (Returned):** Cuando el estudiante devuelve el libro:
    *   El bibliotecario cambia el estado a 'Returned'.
    *   **¡Magia!** El sistema vuelve a marcar el libro como 'Available' (Disponible) automáticamente en el catálogo.

### Renovaciones
Si un estudiante pide más tiempo, el bibliotecario simplemente abre el registro del préstamo y cambia la fecha en el campo 'dueDate' sumándole los días correspondientes.

> [!IMPORTANT]
> **Automatizaciones del Sistema (Cron Jobs):**
> La biblioteca trabaja por ti mientras duermes. Todos los días a medianoche, el sistema revisa:
> *   Si un libro lleva reservado varios días y el estudiante no lo recogió, la reserva se cancela automáticamente y el libro vuelve a estar 'Available'.
> *   Si un préstamo ha vencido (pasó el dueDate), el sistema puede enviar alertas o marcar el préstamo como "Atrasado" dependiendo de tu configuración de notificaciones.

---

## 4. Gestión de Usuarios (Estudiantes)

Bajo la sección **Users** (dentro del plugin *Users & Permissions*), podrás ver a todos los estudiantes registrados.

*   Puedes bloquear a un estudiante cambiando el switch de 'Blocked' a 'ON' (Verdadero). Un estudiante bloqueado no podrá hacer nuevas reservaciones en la página web.
*   Puedes restablecer contraseñas manualmente si un estudiante la olvida.

## 5. Estadísticas e Informes (Descargas)

Si subes archivos digitales o PDFs adjuntos a los libros, el sistema lleva un conteo automático de cuántas veces se ha descargado cada material usando la colección **Download Stats (Estadísticas de Descarga)**. 
Aquí podrás ver qué libros digitales son los más populares entre los estudiantes.
      `;

      const italianManual = `
# Manuale di Amministrazione - Biblioteca Dante Alighieri

Benvenuto nel manuale ufficiale di gestione della Biblioteca Digitale Dante Alighieri. Questo documento è stato concepito per guidare i bibliotecari e gli amministratori nell'uso quotidiano del sistema.

## 1. Accesso al Sistema

Il sistema è diviso in due parti:
*   **Frontend (Portale Pubblico):** Dove gli studenti esplorano i libri ed effettuano prenotazioni.
*   **Pannello di Amministrazione (Strapi):** Il centro di controllo privato dove i bibliotecari gestiscono l'inventario, i prestiti e gli utenti.

Per accedere al Pannello di Amministrazione, vai su tuo-dominio.com/admin (o http://localhost:1337/admin in sviluppo) e accedi con le tue credenziali di amministratore.

> [!TIP]
> **Cambiare la Lingua in Italiano:**
> 1. Fai clic sulle tue iniziali nell'angolo in basso a sinistra.
> 2. Seleziona **Profile** (Profilo).
> 3. In **Interface language**, scegli **Italiano** e fai clic su Salva.

---

## 2. Gestione del Catalogo (Libri)

Nel menu laterale sinistro, sotto la sezione **Content Manager (Gestore dei Contenuti)**, troverai la collezione **Books (Libri)**.

### Aggiungere un nuovo libro
1. Fai clic su **Create new entry** (Crea nuova voce).
2. Compila i campi obbligatori:
    *   **Titolo** e **Autore**.
    *   **Lingua:** Italiano, Bilingue, ecc.
    *   **Livello:** A1, A2, B1, B2, C1, C2.
    *   **Stato:** Segna sempre come 'Available' (Disponibile) alla creazione.
3. **Copertina (Cover):** Fai clic per caricare l'immagine. Grazie all'integrazione con Cloudinary, l'immagine verrà ottimizzata e salvata nel cloud automaticamente.
4. Fai clic su **Save** (Salva) e poi su **Publish** (Pubblica) affinché gli studenti possano vederlo.

---

## 3. Gestione di Prestiti e Prenotazioni

Il cuore della biblioteca è la collezione **Loans (Prestiti)**. Qui vedrai tutte le interazioni degli studenti con i libri.

### Ciclo di vita di un prestito:
1. **Prenotazione (Reserved):** Uno studente richiede un libro dal sito web. Il sistema crea un record con stato 'Reserved'. Il libro cambia automaticamente il suo stato in 'Reserved' in modo che nessun altro possa richiederlo.
2. **Prestito Attivo (Loaned):** Quando lo studente ritira fisicamente il libro in biblioteca:
    *   Il bibliotecario apre il record della prenotazione.
    *   Cambia lo stato in 'Loaned'.
    *   Imposta la data di restituzione (dueDate).
3. **Restituzione (Returned):** Quando lo studente restituisce il libro:
    *   Il bibliotecario cambia lo stato in 'Returned'.
    *   **Magia!** Il sistema segna di nuovo il libro come 'Available' (Disponibile) automaticamente nel catalogo.

### Rinnovi
Se uno studente chiede più tempo, il bibliotecario apre semplicemente il record del prestito e modifica la data nel campo 'dueDate' aggiungendo i giorni corrispondenti.

> [!IMPORTANT]
> **Automazioni del Sistema (Cron Jobs):**
> La biblioteca lavora per te mentre dormi. Ogni giorno a mezzanotte, il sistema controlla:
> *   Se un libro è prenotato da diversi giorni e lo studente non lo ha ritirato, la prenotazione viene annullata automaticamente e il libro torna a essere 'Available'.
> *   Se un prestito è scaduto (ha superato la dueDate), il sistema può inviare avvisi o segnare il prestito come "In ritardo" a seconda della configurazione delle notifiche.

---

## 4. Gestione degli Utenti (Studenti)

Sotto la sezione **Users** (all'interno del plugin *Users & Permissions*), potrai vedere tutti gli studenti registrati.

*   Puoi bloccare uno studente cambiando l'interruttore da 'Blocked' a 'ON' (Vero). Uno studente bloccato non potrà effettuare nuove prenotazioni sul sito web.
*   Puoi reimpostare manualmente le password se uno studente la dimentica.

## 5. Statistiche e Report (Download)

Se carichi file digitali o PDF allegati ai libri, il sistema tiene un conteggio automatico di quante volte ogni materiale è stato scaricato utilizzando la collezione **Download Stats (Statistiche di Download)**. 
Qui potrai vedere quali libri digitali sono i più popolari tra gli studenti.
      `;

      try {
        const existingManual = await strapi.query('api::manual.manual').findOne({});
        
        if (!existingManual) {
          await strapi.query('api::manual.manual').create({
            data: {
              spanish: spanishManual,
              italian: italianManual,
            }
          });
          console.log('Manual content seeded successfully.');
        } else {
          await strapi.query('api::manual.manual').update({
            where: { id: existingManual.id },
            data: {
              spanish: spanishManual,
              italian: italianManual,
            }
          });
          console.log('Manual content updated successfully.');
        }
      } catch (err) {
        console.error('Failed to seed manual content:', err.message);
      }
    } catch (error) {
      console.error('Error setting up initial data/permissions:', error);
    }
  },
};
