'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AgendarPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Inserir Cliente
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert([{ name, phone }])
      .select()
      .single();

    if (clientError) {
      alert('Erro ao salvar cliente');
      return;
    }

    // 2. Inserir Agendamento
    const { error: apptError } = await supabase
      .from('appointments')
      .insert([{ client_id: client.id, appointment_date: date }]);

    if (apptError) {
      alert('Erro ao agendar');
      return;
    }

    alert('Agendado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <h1 className="text-2xl font-bold text-pink-900 mb-6">Novo Agendamento</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)}
          className="p-3 rounded-lg border border-pink-200" required
        />
        <input
          type="tel" placeholder="Seu WhatsApp" value={phone} onChange={e => setPhone(e.target.value)}
          className="p-3 rounded-lg border border-pink-200" required
        />
        <input
          type="datetime-local" value={date} onChange={e => setDate(e.target.value)}
          className="p-3 rounded-lg border border-pink-200" required
        />
        <button type="submit" className="py-3 bg-pink-600 text-white font-bold rounded-lg">
          Confirmar Agendamento
        </button>
      </form>
    </div>
  );
}
