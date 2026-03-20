import { Contact } from '../entities/contact.entity';

export const CONTACT_REPOSITORY = 'CONTACT_REPOSITORY';

export interface ContactRepository {
  save(contact: Contact): Promise<void>;
  findById(id: string): Promise<Contact | null>;
  findAll(): Promise<Contact[]>;
  update(contact: Contact): Promise<void>;
  delete(id: string): Promise<void>;
}
