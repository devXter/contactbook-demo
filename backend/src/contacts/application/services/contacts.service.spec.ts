import { NotFoundException } from '@nestjs/common';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactRepository } from '../../domain/ports/contact.repository';
import { ContactsService } from './contacts.service';

class FakeContactRepository implements ContactRepository {
  private contacts: Contact[] = [];

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

describe('ContactsService', () => {
  let service: ContactsService;
  let repository: FakeContactRepository;

  beforeEach(() => {
    repository = new FakeContactRepository();
    service = new ContactsService(repository);
  });

  it('should_return_created_contact_with_generated_id_when_input_is_valid', async () => {
    // Arrange
    const input = { name: 'Alice', email: 'alice@example.com', phone: '123456789' };

    // Act
    const result = await service.create(input);

    // Assert
    expect(result.id).toBeDefined();
    expect(result.name).toBe('Alice');
    expect(result.email).toBe('alice@example.com');
    expect(result.phone).toBe('123456789');
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('should_persist_contact_when_create_is_called', async () => {
    // Arrange
    const input = { name: 'Bob', email: 'bob@example.com', phone: '987654321' };

    // Act
    const created = await service.create(input);
    const found = await service.findById(created.id);

    // Assert
    expect(found).toEqual(created);
  });

  it('should_return_contact_when_id_exists', async () => {
    // Arrange
    const contact = new Contact('abc-123', 'Carol', 'carol@example.com', '111222333', new Date());
    await repository.save(contact);

    // Act
    const result = await service.findById('abc-123');

    // Assert
    expect(result).toEqual(contact);
  });

  it('should_throw_NotFoundException_when_id_not_found', async () => {
    // Arrange — empty repository

    // Act & Assert
    await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
  });

  it('should_return_empty_array_when_no_contacts', async () => {
    // Arrange — empty repository

    // Act
    const result = await service.findAll();

    // Assert
    expect(result).toEqual([]);
  });

  it('should_return_all_contacts_when_multiple_exist', async () => {
    // Arrange
    const c1 = new Contact('1', 'Alice', 'alice@example.com', '111', new Date());
    const c2 = new Contact('2', 'Bob', 'bob@example.com', '222', new Date());
    await repository.save(c1);
    await repository.save(c2);

    // Act
    const result = await service.findAll();

    // Assert
    expect(result).toHaveLength(2);
    expect(result).toEqual(expect.arrayContaining([c1, c2]));
  });

  it('should_update_only_provided_fields_when_partial_input', async () => {
    // Arrange
    const contact = new Contact('id-1', 'Alice', 'alice@example.com', '000', new Date());
    await repository.save(contact);

    // Act
    const result = await service.update('id-1', { name: 'Alice Updated' });

    // Assert
    expect(result.name).toBe('Alice Updated');
    expect(result.email).toBe('alice@example.com');
    expect(result.phone).toBe('000');
  });

  it('should_throw_NotFoundException_when_updating_nonexistent_contact', async () => {
    // Arrange — empty repository

    // Act & Assert
    await expect(service.update('ghost-id', { name: 'Ghost' })).rejects.toThrow(NotFoundException);
  });

  it('should_remove_contact_when_id_exists', async () => {
    // Arrange
    const contact = new Contact('del-1', 'Dave', 'dave@example.com', '333', new Date());
    await repository.save(contact);

    // Act
    await service.remove('del-1');
    const all = await service.findAll();

    // Assert
    expect(all).toHaveLength(0);
  });

  it('should_throw_NotFoundException_when_removing_nonexistent_contact', async () => {
    // Arrange — empty repository

    // Act & Assert
    await expect(service.remove('ghost-id')).rejects.toThrow(NotFoundException);
  });
});
