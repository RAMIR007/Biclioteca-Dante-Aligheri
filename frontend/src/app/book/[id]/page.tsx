import Image from "next/image";
import Link from "next/link";
import { getBook, getStrapiURL } from "@/lib/api";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookDetail({ params }: Props) {
  const { id } = await params;
  let book = null;

  try {
    const res = await getBook(id);
    if (res && res.data) {
      book = {
        id: res.data.documentId,
        title: res.data.title,
        author: res.data.author,
        level: res.data.level,
        language: res.data.language,
        status: res.data.status,
        isbn: res.data.isbn,
        coverUrl: res.data.cover?.url ? getStrapiURL(res.data.cover.url) : null,
        description: "Sin descripción en catálogo"
      };
    }
  } catch (e) {
    console.error("Failed to fetch book from Strapi:", e);
  }

  // Fallback to mock data if Strapi is not running or book not found
  if (!book && id.startsWith('p')) {
     book = { 
      id, 
      title: "Libro de Ejemplo", 
      author: "Autor Desconocido", 
      level: "B1", 
      language: "Italian", 
      status: "Available", 
      publishYear: "N/A",
      isbn: "N/A",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
      description: "Este es un libro de demostración porque Strapi no está conectado o el libro no existe."
    };
  }

  if (!book) {
    return (
      <main className="min-h-screen bg-[var(--background)] py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">Libro no encontrado</h1>
          <Link href="/" className="text-[var(--color-primary)] hover:underline">← Volver al catálogo</Link>
        </div>
      </main>
    );
  }

  const isAvailable = book.status === "Available";

  return (
    <main className="min-h-screen bg-[var(--background)] py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb nav */}
        <nav className="mb-8 overflow-hidden">
          <Link href="/" className="text-[var(--color-primary)] hover:underline flex items-center gap-2 mb-4 w-max">
            ← Volver al catálogo
          </Link>
        </nav>

        <div className="bg-[var(--color-card)] rounded-3xl shadow-xl overflow-hidden border border-[var(--color-border)]">
          <div className="flex flex-col md:flex-row">
            
            {/* Book Cover Area */}
            <div className="md:w-2/5 p-8 flex justify-center items-center bg-gray-50 dark:bg-black/20">
              <div className="relative w-full max-w-xs aspect-[2/3] rounded-xl overflow-hidden shadow-2xl transform transition-transform hover:scale-105 duration-500">
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 shadow-lg">
                    Sin Portada
                  </div>
                )}
              </div>
            </div>

            {/* Book Details Area */}
            <div className="md:w-3/5 p-8 md:p-12 flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{book.author}</span>
                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                    isAvailable ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                  {isAvailable ? "Disponible" : "Prestado"}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] mb-6 tracking-tight">
                {book.title}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="bg-gray-100 dark:bg-gray-800 text-[var(--foreground)] px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700">
                  Nivel: <strong>{book.level}</strong>
                </span>
                <span className="bg-gray-100 dark:bg-gray-800 text-[var(--foreground)] px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700">
                  Idioma: <strong>{book.language}</strong>
                </span>
                {book.isbn && (
                <span className="bg-gray-100 dark:bg-gray-800 text-[var(--foreground)] px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700">
                  ISBN: {book.isbn}
                </span>
                )}
              </div>

              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 mb-10 text-lg leading-relaxed">
                <p>{book.description}</p>
              </div>

              <div className="mt-auto">
                {isAvailable ? (
                  <button className="w-full md:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Solicitar Préstamo
                  </button>
                ) : (
                  <button className="w-full md:w-auto bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-dark)] text-white px-10 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-xl">
                    Anotarme en lista de espera
                  </button>
                )}
                <p className="text-sm text-gray-400 mt-4 text-center md:text-left">
                  * Recuerda que tienes 3 días para recoger tu libro después de realizar la solicitud de préstamo online.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
