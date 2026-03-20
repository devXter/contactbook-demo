import { Module } from '@nestjs/common';
import { ContactsService } from './application/services/contacts.service';
import { CONTACT_REPOSITORY } from './domain/ports/contact.repository';
import { CONTACTS_SERVICE } from './domain/ports/contacts.service.port';
import { InMemoryContactRepository } from './infrastructure/adapters/in-memory-contact.repository';
import { ContactsController } from './infrastructure/controllers/contacts.controller';

@Module({
  controllers: [ContactsController],
  providers: [
    {
      provide: CONTACT_REPOSITORY,
      useClass: InMemoryContactRepository,
    },
    {
      provide: CONTACTS_SERVICE,
      useClass: ContactsService,
    },
  ],
})
export class ContactsModule {}
