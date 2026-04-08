"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import { Input } from "./input";
import { useEffect, useState } from "react";

function SearchInput({
  pathname,
  ...props
}: React.ComponentProps<"input"> & {
  pathname: string;
}) {
  const params = useSearchParams();
  const [text, setText] = useState<string>();
  const router = useRouter();
  const [value] = useDebounce(text, 300);

  useEffect(() => {
    if (value != null) {
      router.replace(`${pathname}?q=${value}`);
    }
  }, [value]);

  return (
    <Input
      placeholder="Search for subjects"
      name="q"
      defaultValue={""}
      onChange={(e) => {
        setText(e.target.value);
      }}
      {...props}
    />
  );
}

export { SearchInput };
