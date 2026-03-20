import { Contact } from '../entities/contact.entity';

export const CONTACTS_SERVICE = 'CONTACTS_SERVICE';

export interface CreateContactInput {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateContactInput {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ContactsServicePort {
  create(input: CreateContactInput): Promise<Contact>;
  findById(id: string): Promise<Contact>;
  findAll(): Promise<Contact[]>;
  update(id: string, input: UpdateContactInput): Promise<Contact>;
  remove(id: string): Promise<void>;
  toggleFavorite(id: string): Promise<Contact>;
}
