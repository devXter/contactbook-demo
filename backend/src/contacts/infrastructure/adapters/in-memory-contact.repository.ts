import { Injectable } from '@nestjs/common';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactRepository } from '../../domain/ports/contact.repository';

@Injectable()
export class InMemoryContactRepository implements ContactRepository {
  private readonly contacts: Contact[] = [];

  async save(contact: Contact): Promise<void> {
    this.contacts.push(contact);
  }

  async findById(id: string): Promise<Contact | null> {
    return this.contacts.find((c) => c.id === id) ?? null;
  }

  async findAll(): Promise<Contact[]> {
    return [...this.contacts];
  }

  async update(contact: Contact): Promise<void> {
    const index = this.contacts.findIndex((c) => c.id === contact.id);
    if (index !== -1) this.contacts[index] = contact;
  }

  async delete(id: string): Promise<void> {
    const index = this.contacts.findIndex((c) => c.id === id);
    if (index !== -1) this.contacts.splice(index, 1);
  }
}
