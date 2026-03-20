import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CONTACTS_SERVICE } from '../../domain/ports/contacts.service.port';
import type { ContactsServicePort } from '../../domain/ports/contacts.service.port';
import { CreateContactDto } from '../dtos/create-contact.dto';
import { UpdateContactDto } from '../dtos/update-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(
    @Inject(CONTACTS_SERVICE)
    private readonly contactsService: ContactsServicePort,
  ) {}

  @Post()
  create(@Body() dto: CreateContactDto) {
    return this.contactsService.create(dto);
  }

  @Get()
  findAll() {
    return this.contactsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.contactsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }

  @Patch(':id/favorite')
  toggleFavorite(@Param('id') id: string) {
    return this.contactsService.toggleFavorite(id);
  }
}
