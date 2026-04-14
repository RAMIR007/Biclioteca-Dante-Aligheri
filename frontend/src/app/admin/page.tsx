export default function AdminDashboard() {
  const pendingRequests = [
    { id: 201, user: "Juan Pérez", book: "La Divina Commedia", date: "2024-03-20", status: "Pending" },
    { id: 202, user: "María García", book: "Pinocchio", date: "2024-03-19", status: "Pending" },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">Panel Bibliotecario</h1>
            <p className="text-gray-500">Gestión de préstamos y devoluciones físicas</p>
          </div>
          <div className="bg-[var(--color-secondary)] text-white px-4 py-2 rounded-lg font-bold shadow-md">
            Modo: Aprobación Manual
          </div>
        </header>

        <div className="bg-[var(--color-card)] rounded-2xl shadow border border-[var(--color-border)] p-6">
          <h2 className="text-xl font-bold mb-6 text-[var(--foreground)] flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            Solicitudes Pendientes (Recogida Física)
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 text-sm uppercase tracking-wide">
                  <th className="pb-3 px-4">ID Solicitud</th>
                  <th className="pb-3 px-4">Usuario</th>
                  <th className="pb-3 px-4">Libro Reservado</th>
                  <th className="pb-3 px-4">Fecha Solicitud</th>
                  <th className="pb-3 px-4 text-right">Acción (Al Entregar Libro)</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map(req => (
                  <tr key={req.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4 font-mono text-sm">#{req.id}</td>
                    <td className="py-4 px-4 font-medium text-[var(--foreground)]">{req.user}</td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{req.book}</td>
                    <td className="py-4 px-4 text-gray-500">{req.date}</td>
                    <td className="py-4 px-4 text-right">
                      <button className="bg-[var(--color-italia-green)] hover:bg-[var(--color-italia-green-dark)] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5">
                        Aprobar y Entregar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
