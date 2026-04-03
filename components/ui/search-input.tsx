"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./input";

function SearchInput({ pathname }: { pathname: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const debounced = useDebouncedCallback((value: string) => {
    router.push(`${pathname}?q=${value}`);
  }, 300);

  return (
    <Input
      placeholder="Search for subjects"
      name="q"
      defaultValue={params.get("q") || ""}
      onChange={(e) => {
        debounced(e.currentTarget.value);
      }}
    />
  );
}

export { SearchInput };
