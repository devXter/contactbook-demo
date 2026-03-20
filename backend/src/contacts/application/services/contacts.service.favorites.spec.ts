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

describe('ContactsService — favorites', () => {
  let service: ContactsService;
  let repository: FakeContactRepository;

  beforeEach(() => {
    repository = new FakeContactRepository();
    service = new ContactsService(repository);
  });

  it('should_set_isFavorite_true_when_contact_is_not_favorite', async () => {
    // Arrange
    const contact = new Contact('id-1', 'Alice', 'alice@example.com', '111', new Date(), false);
    await repository.save(contact);

    // Act
    const result = await service.toggleFavorite('id-1');

    // Assert
    expect(result.isFavorite).toBe(true);
  });

  it('should_set_isFavorite_false_when_contact_is_already_favorite', async () => {
    // Arrange
    const contact = new Contact('id-2', 'Bob', 'bob@example.com', '222', new Date(), true);
    await repository.save(contact);

    // Act
    const result = await service.toggleFavorite('id-2');

    // Assert
    expect(result.isFavorite).toBe(false);
  });

  it('should_return_updated_contact_with_all_fields_after_toggle', async () => {
    // Arrange
    const contact = new Contact('id-3', 'Carol', 'carol@example.com', '333', new Date(), false);
    await repository.save(contact);

    // Act
    const result = await service.toggleFavorite('id-3');

    // Assert
    expect(result.id).toBe('id-3');
    expect(result.name).toBe('Carol');
    expect(result.isFavorite).toBe(true);
  });

  it('should_persist_favorite_change_when_toggle_is_called', async () => {
    // Arrange
    const contact = new Contact('id-4', 'Dave', 'dave@example.com', '444', new Date(), false);
    await repository.save(contact);

    // Act
    await service.toggleFavorite('id-4');
    const found = await service.findById('id-4');

    // Assert
    expect(found.isFavorite).toBe(true);
  });

  it('should_throw_NotFoundException_when_toggling_nonexistent_contact', async () => {
    // Arrange — empty repository

    // Act & Assert
    await expect(service.toggleFavorite('ghost-id')).rejects.toThrow(NotFoundException);
  });

  it('should_return_favorites_first_when_findAll_called', async () => {
    // Arrange
    const regular = new Contact('a', 'Alice', 'alice@example.com', '111', new Date(), false);
    const favorite = new Contact('b', 'Bob', 'bob@example.com', '222', new Date(), true);
    await repository.save(regular);
    await repository.save(favorite);

    // Act
    const result = await service.findAll();

    // Assert
    expect(result[0].isFavorite).toBe(true);
    expect(result[1].isFavorite).toBe(false);
  });

  it('should_restore_isFavorite_false_when_toggled_twice', async () => {
    // Arrange
    const contact = new Contact('id-5', 'Eve', 'eve@example.com', '555', new Date(), false);
    await repository.save(contact);

    // Act
    await service.toggleFavorite('id-5');
    const result = await service.toggleFavorite('id-5');

    // Assert
    expect(result.isFavorite).toBe(false);
  });
});
