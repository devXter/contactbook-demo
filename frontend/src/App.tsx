import { useState, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  isFavorite: boolean;
}

type LoadingState = 'loading' | 'error' | 'ready';

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [status, setStatus] = useState<LoadingState>('loading');
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const response = await fetch('http://localhost:3000/contacts');
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data: Contact[] = await response.json();
        setContacts(data);
        setStatus('ready');
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Error al cargar los contactos');
        setStatus('error');
      }
    };

    loadContacts();
  }, []);

  const sortByFavorite = (list: Contact[]) =>
    [...list].sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));

  const handleContactCreated = (contact: Contact) => {
    setContacts((prev) => sortByFavorite([contact, ...prev]));
  };

  const handleToggleFavorite = async (id: string) => {
    const response = await fetch(`http://localhost:3000/contacts/${id}/favorite`, {
      method: 'PATCH',
    });
    if (!response.ok) return;
    const updated: Contact = await response.json();
    setContacts((prev) => sortByFavorite(prev.map((c) => (c.id === id ? updated : c))));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 shadow">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-bold text-white tracking-tight">ContactBook</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <ContactForm onContactCreated={handleContactCreated} />

        {status === 'loading' && (
          <p className="text-center text-gray-400 text-sm py-8">Cargando...</p>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm">
            {fetchError}
          </div>
        )}

        {status === 'ready' && (
          <ContactList contacts={contacts} onToggleFavorite={handleToggleFavorite} />
        )}
      </main>
    </div>
  );
}
