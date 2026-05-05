"use client";

export default function RenewButton({ loanId, disabled }: { loanId: string | number, disabled: boolean }) {
  const handleRenew = async () => {
    // In a full implementation, we'd call a Next.js server action or API route 
    // to change the loan status or add days to the returnDate.
    alert("Solicitud de renovación enviada al administrador.");
  };

  return (
    <button 
      onClick={handleRenew}
      disabled={disabled}
      className={`text-sm font-semibold ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-[var(--color-primary)] hover:underline'}`}
    >
      {disabled ? 'No renovable' : 'Solicitar Renovación'}
    </button>
  );
}
