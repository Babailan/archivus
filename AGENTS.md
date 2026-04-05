# Archivus Development Guidelines

## Project Overview

Next.js 16.1.6 with React 19, TypeScript, Prisma 7.6.0, MySQL. School management system.

- **UI**: Base UI React primitives + shadcn-style components (`@/components/ui/*`)
- **Path alias**: `@/*` maps to project root

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run prettier     # Format with Prettier
```



## Prisma

- Schema: `prisma/schema.prisma`
- Output: `app/generated/prisma` (custom path, not default)
- Provider: MySQL (`mysql`)
- Always filter `inactive: false` for active records
- Convert Decimal: `decimal.toNumber()`

## Server Actions

Use `next-safe-action` with `actionClient` + `zod-form-data`:

```typescript
"use server";

import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";

const schema = zfd.formData({
  id: zfd.numeric(z.number()),
  name: z.string().optional(),
});

export const action = actionClient
  .inputSchema(schema)
  .action(async ({ parsedInput }) => {
    // ... mutate
    revalidatePath("/path");
    return { success: true };
  });
```

## Client Components

Use `use()` to unwrap promises, `useAction` for server actions:

```typescript
"use client";

import { use } from "react";
import { useAction } from "next-safe-action/hooks";

export function Component({ dataPromise }: { dataPromise: Promise<...> }) {
  const data = use(dataPromise);
  // ...
}
```

## Key Patterns

**Search with fallback:**

```typescript
const search = (q: string) =>
  q
    ? prisma.model.findMany({
        where: { name: { search: q + "*" }, inactive: false },
      })
    : prisma.model.findMany({
        where: { inactive: false },
        orderBy: { created_at: "desc" },
      });
```

**Soft delete:**

```typescript
await prisma.model.update({ where: { id }, data: { inactive: true } });
revalidatePath("/path");
```

**Form validation**: zod + zod-form-data + shadcn/ui Field + sonner toast

## File Organization

```
app/(dashboard)/        # Protected routes
app/(auth)/             # Auth routes (login)
services/               # Business logic, return plain objects
components/ui/          # Base UI + shadcn components
```

## Conventions

| Element            | Convention                |
| ------------------ | ------------------------- |
| Files              | kebab-case                |
| Components         | PascalCase                |
| Functions/services | camelCase                 |
| Server actions     | camelCase + Action suffix |
| DB fields          | snake_case                |
