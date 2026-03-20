# Skill: test-bdd

## Metadata

```yaml
name: test-bdd
description: Generate BDD-style unit tests following team conventions
argument-hint: <service-or-component-name>
allowed-tools:
  - Bash(npm:*)
  - Bash(npx:*)
  - Read
  - Grep
  - Glob
  - Write
```

## Instructions

You are a test engineer. When invoked with `/test-bdd <service-or-component-name>`, generate BDD-style unit tests for the given service or component following these conventions strictly.

### Step 1 — Discover

1. Locate the source file for `<service-or-component-name>` using Glob/Grep.
2. Read the source file and identify all public methods or behaviors to test.
3. Identify the ports/interfaces the service depends on (for backend) or the props/interactions (for frontend).

### Step 2 — Plan the tests

- Write a list of test cases before generating any code.
- **Max 10 tests per file.** If more are needed, split into multiple `*.spec.ts` files by concern.
- Always include edge cases: `null`, empty string, not found, duplicates, invalid input.

### Step 3 — Generate

#### Naming convention

```
should_[expected_result]_when_[condition]
```

Examples:

- `should_return_contact_when_id_exists`
- `should_throw_when_email_is_duplicate`
- `should_return_empty_array_when_no_contacts`

#### Pattern — AAA (Arrange → Act → Assert)

Every test must follow this structure:

```typescript
it('should_[expected_result]_when_[condition]', () => {
  // Arrange
  ...

  // Act
  ...

  // Assert
  ...
});
```

#### No shared state — tests are fully independent

- Each `it()` block sets up its own data.
- No `beforeEach` mutations that alter shared objects.
- `beforeEach` is only allowed for constructing fresh instances.

#### Backend — use fakes, NEVER mocks

- Create a fake class that implements the port interface directly in the test file (or a sibling `*.fake.ts`).
- **NEVER use `jest.mock()`, `jest.fn()`, or `jest.spyOn()`.**
- Fakes must use an in-memory array consistent with the project's dummy DB convention.

```typescript
// Good — fake implementing the port
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
}
```

#### Frontend — React Testing Library

- Use `render`, `screen`, `userEvent` from React Testing Library.
- Test user interactions and visible output, not implementation details.
- No snapshots unless explicitly requested.

### Step 4 — Write the test file

- Place the spec file next to the source file: `<name>.spec.ts`
- One export per file rule applies: the test suite is the default export concern.

### Step 5 — Run and verify

After writing, run the tests and confirm they pass:

```bash
cd backend && npx jest <path-to-spec-file> --no-coverage
```

If tests fail, diagnose the root cause and fix either the test or (if you found a real bug) flag it to the user before touching source code.

## Example output structure

```typescript
import { ContactsService } from './contacts.service';
import { Contact } from '../domain/entities/contact.entity';
import { ContactRepository } from '../domain/ports/contact.repository';

class FakeContactRepository implements ContactRepository {
  private contacts: Contact[] = [];
  // ... fake implementation
}

describe('ContactsService', () => {
  let service: ContactsService;
  let repository: FakeContactRepository;

  beforeEach(() => {
    repository = new FakeContactRepository();
    service = new ContactsService(repository);
  });

  it('should_return_contact_when_id_exists', async () => {
    // Arrange
    const contact = new Contact('1', 'Alice', 'alice@example.com');
    await repository.save(contact);

    // Act
    const result = await service.findById('1');

    // Assert
    expect(result).toEqual(contact);
  });

  it('should_return_null_when_id_not_found', async () => {
    // Arrange — empty repository

    // Act
    const result = await service.findById('nonexistent');

    // Assert
    expect(result).toBeNull();
  });
});
```
