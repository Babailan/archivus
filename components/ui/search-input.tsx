"use client";

import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Input } from "./input";
import { useEffect, useState } from "react";

function SearchInput({
  pathname,
  ...props
}: React.ComponentProps<"input"> & {
  pathname: string;
}) {
  const [text, setText] = useState<string>();
  const router = useRouter();
  const [value] = useDebounce(text, 300);

  useEffect(() => {
    if (value != null) {
      router.replace(`${pathname}?q=${value}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
