import { useState, type FormEvent } from 'react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  isFavorite: boolean;
}

interface ContactFormProps {
  onContactCreated: (contact: Contact) => void;
}

interface FormFields {
  name: string;
  email: string;
  phone: string;
}

const INITIAL_FIELDS: FormFields = { name: '', email: '', phone: '' };

export default function ContactForm({ onContactCreated }: ContactFormProps) {
  const [fields, setFields] = useState<FormFields>(INITIAL_FIELDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const contact: Contact = await response.json();
      setFields(INITIAL_FIELDS);
      onContactCreated(contact);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el contacto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Nuevo contacto</h2>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <input
          type="text"
          name="name"
          value={fields.name}
          onChange={handleChange}
          placeholder="Nombre"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="email"
          name="email"
          value={fields.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="tel"
          name="phone"
          value={fields.phone}
          onChange={handleChange}
          placeholder="Teléfono"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        {loading ? 'Guardando...' : 'Guardar contacto'}
      </button>
    </form>
  );
}
