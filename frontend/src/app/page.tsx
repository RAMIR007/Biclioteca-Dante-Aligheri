import Image from "next/image";
import Link from "next/link";
import { getBooks, getStrapiURL } from "@/lib/api";

// Placeholder data representing what we will fetch from Strapi later
const placeholderBooks = [
  { id: 1, documentId: "p1", title: "La Divina Commedia", author: "Dante Alighieri", level: "C2", language: "Italian", status: "Available", coverUrl: "/divina_commedia.png" },
  { id: 2, documentId: "p2", title: "Il Nome della Rosa", author: "Umberto Eco", level: "C1", language: "Italian", status: "Loaned", coverUrl: "/nome_della_rosa.png" },
  { id: 3, documentId: "p3", title: "L'amica geniale", author: "Elena Ferrante", level: "B2", language: "Bilingual", status: "Available", coverUrl: "/amica_geniale.png" },
  { id: 4, documentId: "p4", title: "Pinocchio", author: "Carlo Collodi", level: "A2", language: "Italian", status: "Available", coverUrl: "/pinocchio.png" },
  { id: 5, documentId: "p5", title: "Il Piccolo Principe", author: "Antoine de Saint-Exupéry", level: "A1", language: "Italian", status: "Available", coverUrl: "/piccolo_principe.png" },
];

export default async function Home() {
  let books = [];
  try {
    const res = await getBooks();
    if (res && res.data) {
      books = res.data.map((b: any) => ({
        id: b.id,
        documentId: b.documentId,
        title: b.title,
        author: b.author,
        level: b.level,
        language: b.language,
        status: b.status,
        coverUrl: b.cover?.url ? getStrapiURL(b.cover.url) : null
      }));
    }
  } catch (e) {
    console.error("Failed to fetch books from Strapi:", e);
  }

  const finalBooks = books.length > 0 ? books : placeholderBooks;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Placeholder using random aesthetic library image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/hero_bg.png"
            alt="Library background with Italian books"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="glass-effect p-8 md:p-12 rounded-3xl shadow-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Biblioteca Digital
              <span className="block mt-2 text-[var(--color-italia-green)] font-semibold brightness-125">Dante Alighieri</span>
            </h1>
            <p className="text-gray-200 text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto">
              Descubre nuestra colección de literatura italiana y bilingüe. 
              Reserva tus libros online y sumérgete en el idioma.
            </p>
            <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-900/20">
              Explorar Catálogo
            </button>
          </div>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Novedades y Clásicos</h2>
            <p className="text-gray-500 mt-2">Los títulos más buscados de La Habana</p>
          </div>
          {/* Mock Filter Button */}
          <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filtrar por nivel
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {finalBooks.map((book) => (
            <div key={book.id} className="group flex flex-col bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              
              {/* Cover Image Area */}
              <div className="relative w-full aspect-[2/3] overflow-hidden bg-gray-100">
                {book.coverUrl ? (
                  <Image 
                    src={book.coverUrl} 
                    alt={`Portada de ${book.title}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    Sin Portada
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Level Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm text-[var(--foreground)]">
                  {book.level}
                </div>
              </div>

              {/* Book Info Area */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-bold text-lg leading-tight line-clamp-2 text-[var(--foreground)]">
                    {book.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">{book.author}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                    book.status === 'Available' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30'
                  }`}>
                    {book.status === 'Available' ? 'Disponible' : 'Prestado'}
                  </span>
                  
                  <Link href={`/book/${book.documentId}`} className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium text-sm hover:underline underline-offset-4 transition-all">
                    Ver más →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
