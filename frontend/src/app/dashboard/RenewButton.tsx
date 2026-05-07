"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RenewButton({ loanId, disabled }: { loanId: string | number, disabled: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRenew = async () => {
    if (disabled || loading) return;
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:1337/api/loans/${loanId}/renew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Si tienes autenticación implementada
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Error al renovar el préstamo');
      }

      alert("¡Préstamo renovado exitosamente por 7 días más!");
      router.refresh(); // Recargar la página para ver la nueva fecha
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleRenew}
      disabled={disabled || loading}
      className={`text-sm font-semibold ${(disabled || loading) ? 'text-gray-400 cursor-not-allowed' : 'text-[var(--color-primary)] hover:underline'}`}
    >
      {loading ? 'Renovando...' : (disabled ? 'No renovable' : 'Solicitar Renovación')}
    </button>
  );
}
