export class Contact {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public phone: string,
    public readonly createdAt: Date,
    public isFavorite: boolean = false,
  ) {}
}
