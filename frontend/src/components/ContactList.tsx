interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  isFavorite: boolean;
}

interface ContactListProps {
  contacts: Contact[];
  onToggleFavorite: (id: string) => void;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function ContactCard({
  contact,
  onToggleFavorite,
}: {
  contact: Contact;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow px-6 py-4 flex items-start gap-3">
      <button
        onClick={() => onToggleFavorite(contact.id)}
        className="mt-1 text-xl leading-none focus:outline-none"
        aria-label={contact.isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito'}
      >
        {contact.isFavorite ? '★' : '☆'}
      </button>
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-lg font-semibold text-gray-800">{contact.name}</p>
        <p className="text-sm text-gray-500">{contact.email}</p>
        <p className="text-sm text-gray-500">{contact.phone}</p>
        <p className="text-xs text-gray-400 mt-1">Creado el {formatDate(contact.createdAt)}</p>
      </div>
    </div>
  );
}

export default function ContactList({ contacts, onToggleFavorite }: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12 text-sm">No hay contactos aún</div>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} onToggleFavorite={onToggleFavorite} />
      ))}
    </div>
  );
}
