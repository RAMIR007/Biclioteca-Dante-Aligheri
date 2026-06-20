import { getUserLoans } from "@/lib/api";
import RenewButton from "./RenewButton";

export default async function Dashboard() {
  // Fetch real data from Strapi
  let response = null;
  try {
    response = await getUserLoans();
  } catch (error) {
    console.error("Failed to fetch loans during build:", error);
  }
  const loans = response?.data || [];

  const activeLoans = loans
    .filter((loan: any) => ['Active', 'Overdue', 'Pending'].includes(loan.attributes.status))
    .map((loan: any) => ({
      id: loan.id,
      title: loan.attributes.book?.data?.attributes?.title || "Libro desconocido",
      loanDate: loan.attributes.loanDate,
      returnDate: loan.attributes.returnDate,
      status: loan.attributes.status,
    }));

  const history = loans
    .filter((loan: any) => loan.attributes.status === 'Returned')
    .map((loan: any) => ({
      id: loan.id,
      title: loan.attributes.book?.data?.attributes?.title || "Libro desconocido",
      loanDate: loan.attributes.loanDate,
      returnDate: loan.attributes.returnDate,
      status: loan.attributes.status,
    }));

  const userStats = {
    name: "Estudiante Ejemplo", // In a real app, fetch from auth context
    role: "student",
    activeLoans,
    history,
  };

  return (
    <main className="min-h-screen bg-[var(--background)] py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">Mi Espacio</h1>
          <p className="text-gray-500 mt-2 text-lg">Bienvenido, {userStats.name} 👋</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Active Loans Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--color-card)] rounded-2xl p-6 md:p-8 shadow-sm border border-[var(--color-border)]">
              <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Préstamos Activos</h2>
              
              {userStats.activeLoans.map((loan: any) => (
                <div key={loan.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 mb-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/10 hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-bold text-lg text-[var(--foreground)] mb-1">{loan.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>Dado: {loan.loanDate}</span>
                      <span>Vence: {loan.returnDate}</span>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      loan.status === 'Active' ? 'bg-blue-100 text-blue-700' : 
                      loan.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {loan.status === 'Active' ? 'En Curso' : 
                       loan.status === 'Pending' ? 'Pendiente' : 'Vencido'}
                    </span>
                    <RenewButton loanId={loan.id} disabled={loan.status === 'Overdue'} />
                  </div>
                </div>
              ))}
              
              {userStats.activeLoans.length === 0 && (
                <p className="text-center text-gray-500 py-8">No tienes préstamos activos en este momento.</p>
              )}
            </div>
          </div>

          {/* Sidebar / Options */}
          <div className="space-y-6">
            <div className="bg-[var(--color-italia-green)] text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 3.8L18.4 19H5.6L12 5.8z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 relative z-10">Mantén tu cuenta al día</h3>
              <p className="text-sm text-green-50 relative z-10 mb-4">
                Recuerda devolver tus libros a tiempo para evitar suspensiones.
              </p>
              <button className="bg-white text-[var(--color-italia-green)] w-full py-2 rounded-lg font-bold shadow-sm relative z-10 hover:bg-green-50 transition-colors">
                Ver Normativa
              </button>
            </div>

            <div className="bg-[var(--color-card)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
              <h3 className="font-bold text-[var(--foreground)] mb-4">Historial Reciente</h3>
              <ul className="space-y-4">
                {userStats.history.map((item: any) => (
                  <li key={item.id} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="text-gray-600 dark:text-gray-300">{item.title}</span>
                    <span className="text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">Devuelto</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
