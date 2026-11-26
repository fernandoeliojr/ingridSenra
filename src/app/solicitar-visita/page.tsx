export default function SolicitarVisitaPage() {
  const whatsappLink = "https://wa.me/5532988717749?text=Olá! Gostaria de agendar um horário.";
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Agende seu horário</h1>
      <p className="mb-6 text-gray-600">Clique abaixo para solicitar um horário via WhatsApp.</p>
      <a href={whatsappLink} target="_blank" className="py-4 px-8 bg-green-500 text-white font-bold rounded-xl shadow-lg">
        Enviar WhatsApp
      </a>
    </div>
  );
}
