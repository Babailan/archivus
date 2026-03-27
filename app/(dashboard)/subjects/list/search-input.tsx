"use client";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { KeyboardEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SearchInput({ length }: { length?: number }) {
  const { replace } = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const [searchInput, setSearchInput] = useState(params.get("q") || "");

  function onSubmit(e: KeyboardEvent<HTMLInputElement>) {
    if (e.code == "Enter") {
      replace(`${pathname}?q=${searchInput}`);
    }
  }

  return (
    <InputGroup className="mb-5">
      <InputGroupInput
        placeholder="Search..."
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyUp={onSubmit}
        value={searchInput}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      {length != undefined && (
        <InputGroupAddon align="inline-end">{length} results</InputGroupAddon>
      )}
    </InputGroup>
  );
}
