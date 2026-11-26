'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AgendamentosPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [clientName, setClientName] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [time, setTime] = useState('10:00');

  useEffect(() => {
    fetchAgendamentos();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*');
    if (data) setServices(data);
  };

  const fetchAgendamentos = async () => {
    const { data } = await supabase.from('appointments').select('*, clients(name, phone)');
    if (data) setAgendamentos(data);
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bloquear Domingos (0) e Segundas (1)
    if (selectedDate.getDay() === 0 || selectedDate.getDay() === 1) {
      alert('Não agendamos aos domingos e segundas-feiras.');
      return;
    }

    const totalDuration = services
      .filter(s => selectedServiceIds.includes(s.id))
      .reduce((acc, s) => acc + (s.duration_minutes || s.duration || 0), 0);

    if (totalDuration === 0) {
      alert('Selecione pelo menos um serviço.');
      return;
    }

    const appointmentDate = new Date(selectedDate);
    const [hours, minutes] = time.split(':');
    appointmentDate.setHours(parseInt(hours), parseInt(minutes));

    const endTime = new Date(appointmentDate.getTime() + totalDuration * 60000);

    // Collision detection (simplified: check if new appt overlaps with any existing)
    // Note: This assumes existing appointments have a default duration if they don't have one in DB.
    // For now, assuming 60 mins for existing appointments without duration.
    const hasOverlap = agendamentos.some(a => {
      const start = new Date(a.appointment_date);
      const duration = a.duration || 60;
      const end = new Date(start.getTime() + duration * 60000);
      return (appointmentDate < end && endTime > start);
    });

    if (hasOverlap) {
      alert('Este horário está ocupado ou conflita com outro agendamento!');
      return;
    }

    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert([{ name: clientName, phone: 'N/A' }])
      .select()
      .single();

    if (clientError) { alert('Erro: ' + clientError.message); return; }

    const { error: apptError } = await supabase
      .from('appointments')
      .insert([{
        client_id: client.id,
        appointment_date: appointmentDate.toISOString(),
        duration: totalDuration,
        service_ids: selectedServiceIds
      }]);

    if (apptError) { alert('Erro: ' + apptError.message); return; }

    alert('Agendado!');
    setClientName('');
    setSelectedServiceIds([]);
    fetchAgendamentos();
  };

  // Resumo do dia atual
  const hoje = new Date();
  const agendamentosHoje = agendamentos.filter(a => isSameDay(new Date(a.appointment_date), hoje));

  return (
    <div className="p-5 pb-24">
      <h1 className="text-xl font-bold mb-4">Agenda</h1>

      {/* Calendário */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-pink-100/60 mb-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1 text-[#be3a6c] font-bold">&lt;</button>
          <h2 className="font-bold capitalize text-[#351d28]">{format(currentDate, 'MMMM yyyy', { locale: ptBR })}</h2>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1 text-[#be3a6c] font-bold">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <div key={d} className="font-bold text-gray-400 py-1">{d}</div>)}
          {days.map(day => (
            <button
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={`p-2 rounded-full font-medium transition ${
                isSameDay(day, selectedDate)
                  ? 'bg-gradient-to-r from-[#ce3a6f] to-[#be3a6c] text-white shadow-sm'
                  : (day.getDay() === 0 || day.getDay() === 1)
                  ? 'text-gray-300 hover:bg-pink-50'
                  : 'text-[#351d28] hover:bg-pink-100/70'
              }`}
            >
              {format(day, 'd')}
            </button>
          ))}
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleAddAppointment} className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-pink-100/60 space-y-3 mb-6">
        <h3 className="font-bold text-[#351d28]">Novo Agendamento ({format(selectedDate, 'dd/MM')})</h3>
        <input
          placeholder="Nome da cliente"
          value={clientName}
          onChange={e => setClientName(e.target.value)}
          className="w-full p-3 rounded-xl border border-pink-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#be3a6c]/30 text-sm"
          required
        />

        <div className="space-y-2 border border-pink-100 bg-white/60 p-3 rounded-xl">
          <p className="text-xs font-semibold text-[#876e78] uppercase tracking-wide">Selecione os Serviços:</p>
          {services.length === 0 ? (
            <p className="text-xs text-gray-400">Nenhum serviço cadastrado.</p>
          ) : (
            services.map(s => (
              <label key={s.id} className="flex items-center gap-2.5 text-sm cursor-pointer py-1">
                <input
                  type="checkbox"
                  className="rounded text-[#be3a6c] focus:ring-[#be3a6c] accent-[#be3a6c]"
                  checked={selectedServiceIds.includes(s.id)}
                  onChange={e => {
                    if (e.target.checked) setSelectedServiceIds([...selectedServiceIds, s.id]);
                    else setSelectedServiceIds(selectedServiceIds.filter(id => id !== s.id));
                  }}
                />
                <span className="text-[#351d28]">{s.name} ({s.duration_minutes || s.duration} min)</span>
              </label>
            ))
          )}
        </div>

        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          className="w-full p-3 rounded-xl border border-pink-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#be3a6c]/30 text-sm"
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#ce3a6f] via-[#be3a6c] to-[#a62a56] text-white rounded-xl font-bold shadow-md hover:opacity-95 transition"
        >
          Confirmar Agendamento
        </button>
      </form>

      {/* Resumo do dia atual */}
      {agendamentosHoje.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-pink-100/60 mb-6">
          <h3 className="font-bold mb-4 text-[#351d28]">Resumo de Hoje ({format(hoje, 'dd/MM')})</h3>
          <div className="space-y-3">
            {agendamentosHoje
              .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
              .map(a => (
                <div key={a.id} className="flex items-center gap-3 py-2 border-b border-pink-100 last:border-0">
                  <span className="text-xs font-bold text-[#be3a6c] bg-pink-50 border border-pink-200 px-2.5 py-1 rounded-lg">
                    {format(new Date(a.appointment_date), 'HH:mm')}
                  </span>
                  <span className="font-semibold text-sm text-[#422c36]">
                    {a.clients?.name}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
