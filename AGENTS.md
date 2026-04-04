# AGENTS.md - Archivus Development Guidelines

This file contains guidelines for AI agents working in this repository.

## Project Overview

Archivus is a Next.js 16 application with React 19, TypeScript, Prisma ORM, and Tailwind CSS. It appears to be a school management system with features for managing curricula, subjects, and students.

## Build/Lint/Test Commands

```bash
# Development
npm run dev              # Start development server

# Production
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run prettier         # Format all files with Prettier
```

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode is enabled** (`strict: true`, `strictNullChecks: true`)
- Always define explicit types for function parameters and return values
- Use `null` explicitly when a value is absent, avoid `undefined` for intentional absence
- Always handle null checks explicitly

### Imports

- Use path aliases (`@/*` for project root)
- **Server-only code**: Add `"use server"` at the top of server action files
- **Client-only code**: Add `"use client"` at the top of client component files
- Import ordering: React/Next imports first, then third-party, then local imports
- Group related imports together

```typescript
// Example: Server Action
"use server";

import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import prisma from "@/lib/dbClient";
import { revalidatePath } from "next/cache";
```

```typescript
// Example: Client Component
"use client";

import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { use } from "react";
```

### Naming Conventions

| Element          | Convention                   | Example                                                     |
| ---------------- | ---------------------------- | ----------------------------------------------------------- |
| Functions        | camelCase                    | `getCurriculum`, `searchSubject`                            |
| Types/Interfaces | PascalCase                   | `SearchSubjectResult`, `CurriculumWithSubjects`             |
| Components       | PascalCase                   | `SubjectListForm`, `DeleteDialog`                           |
| Files            | kebab-case                   | `curriculum-list-table.tsx`, `delete-curriculum-dialog.tsx` |
| Database fields  | snake_case                   | `curriculum_name`, `subject_code`                           |
| React props      | camelCase                    | `subjectsPromise`, `curriculums`                            |
| Server actions   | camelCase with Action suffix | `deleteCurriculumAction`, `updateSubjectAction`             |
| Services         | camelCase                    | `curriculum.service.ts`, `subject.service.ts`               |

### Component Patterns

#### Server Components (async)

- Use for data fetching at page level
- Fetch data and pass promises to client components
- Use Suspense with fallback for loading states

```typescript
// app/(dashboard)/curriculum/page.tsx
export default async function CurriculumPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const curriculums = searchCurriculum(q);
  return (
    <Suspense fallback={<SkeletonTable />}>
      <CurriculumListForm curriculumsPromise={curriculums} />
    </Suspense>
  );
}
```

#### Client Components (with promises)

- Use `use()` hook from React to unwrap promises
- Use `useAction` hook from `next-safe-action/hooks` for server actions
- Handle loading, error, and success states

```typescript
"use client";

import { use } from "react";
import { useAction } from "next-safe-action/hooks";

export function CurriculumListForm({
  curriculumsPromise,
}: {
  curriculumsPromise: Promise<SearchSubjectResult>;
}) {
  const data = use(curriculumsPromise);
  // ...
}
```

### Server Actions

Use `next-safe-action` with `actionClient` for type-safe server actions:

```typescript
// Define schema with zod-form-data
const updateSubjectInputSchema = zfd.formData({
  id: zfd.numeric(z.number()),
  subject_name: z.string().optional(),
});

export const updateSubjectAction = actionClient
  .inputSchema(updateSubjectInputSchema)
  .action(async ({ parsedInput: { id, subject_name } }) => {
    await prisma.subject.update({ where: { id }, data: { subject_name } });
    revalidatePath("/subjects");
    return { success: true };
  });
```

### Database Operations (Prisma)

- Always use `inactive: false` filter when fetching active records
- Convert Prisma Decimal types to numbers: `decimal.toNumber()`
- Use transactions for multi-step operations: `prisma.$transaction([...])`
- Use `prisma.modelName.findUnique` for single records, `findMany` for lists

```typescript
// Convert Decimal to number
return {
  ...curriculum,
  miscellaneous_fee: curriculum.miscellaneous_fee.toNumber(),
  curriculum_subjects: curriculum.curriculum_subjects.map((cs) => ({
    ...cs,
    price: cs.subject_price.price.toNumber(),
  })),
};
```

### Form Handling

- Use `zod` with `zod-form-data` for form validation
- Use shadcn/ui Field component for label/error structure
- Use sonner `toast` for user feedback
- Always revalidate relevant paths after mutations

### UI Components

- Use shadcn/ui components from `@/components/ui/`
- Use Tailwind CSS for styling with `@/lib/utils` `cn()` helper
- Prefer composition over complex variants
- Use `className` for custom styling

### Error Handling

- Use `returnValidationErrors` from `next-safe-action` for validation errors
- Use `toast.error()` for user-facing error messages
- Log server errors with `console.log` (for now)
- Always return `{ success: true/false }` from server actions

### File Organization

```
app/(dashboard)/
├── curriculum/
│   ├── action.ts           # Server actions
│   ├── curriculum-list-table.tsx  # Client table component
│   ├── edit-curriculum-dialog.tsx
│   ├── delete-curriculum-dialog.tsx
│   ├── create/
│   │   ├── page.tsx
│   │   └── create-curriculum-form.tsx
│   └── edit/[id]/
│       ├── page.tsx
│       └── edit-curriculum-form.tsx
├── subjects/
│   └── ...
services/
├── curriculum.service.ts
└── subject.service.ts
```

### API Design for Services

- Return plain objects (not Prisma types) from services
- Transform Decimal types to numbers
- Always return `null` for "not found" cases
- Export type aliases for return types

```typescript
export type CurriculumWithSubjects = Awaited<ReturnType<typeof getCurriculum>>;

export async function getCurriculum(id: number) {
  const curriculum = await prisma.curriculum.findUnique({ ... });
  if (!curriculum) return null;
  return { ...curriculum, decimalField: curriculum.decimalField.toNumber() };
}
```

## Common Patterns

### Search with Fallback

```typescript
const searchSubject = (q: string) => {
  if (q) {
    return prisma.subject.findMany({
      where: { subject_name: { search: q + "*" }, inactive: false },
    });
  }
  return prisma.subject.findMany({
    where: { inactive: false },
    orderBy: { created_at: "desc" },
  });
};
```

### Delete (Soft Delete)

```typescript
await prisma.model.update({
  where: { id },
  data: { inactive: true },
});
revalidatePath("/path");
```

### Table with Dropdown Actions

```typescript
<DropdownMenu>
  <DropdownMenuTrigger render={<Button size="icon-sm" variant="ghost"><Ellipsis /></Button>}/>
  <DropdownMenuContent>
    <DropdownMenuGroup><EditDialog id={id} /></DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup><DeleteDialog id={id} /></DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
```
