import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Contact } from '../../domain/entities/contact.entity';
import { CONTACT_REPOSITORY } from '../../domain/ports/contact.repository';
import type { ContactRepository } from '../../domain/ports/contact.repository';
import {
  ContactsServicePort,
  CreateContactInput,
  UpdateContactInput,
} from '../../domain/ports/contacts.service.port';

@Injectable()
export class ContactsService implements ContactsServicePort {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly contactRepository: ContactRepository,
  ) {}

  async create(input: CreateContactInput): Promise<Contact> {
    const contact = new Contact(uuidv4(), input.name, input.email, input.phone, new Date());
    await this.contactRepository.save(contact);
    return contact;
  }

  async findById(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findById(id);
    if (!contact) throw new NotFoundException(`Contact ${id} not found`);
    return contact;
  }

  async findAll(): Promise<Contact[]> {
    const all = await this.contactRepository.findAll();
    return all.sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));
  }

  async toggleFavorite(id: string): Promise<Contact> {
    const contact = await this.findById(id);
    contact.isFavorite = !contact.isFavorite;
    await this.contactRepository.update(contact);
    return contact;
  }

  async update(id: string, input: UpdateContactInput): Promise<Contact> {
    const contact = await this.findById(id);
    if (input.name !== undefined) contact.name = input.name;
    if (input.email !== undefined) contact.email = input.email;
    if (input.phone !== undefined) contact.phone = input.phone;
    await this.contactRepository.update(contact);
    return contact;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.contactRepository.delete(id);
  }
}
