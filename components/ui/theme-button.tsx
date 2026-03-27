"use client";

import { useTheme } from "next-themes";
import { Button } from "./button";
import { Moon, Sun } from "lucide-react";

function ThemeButton() {
  const { setTheme, theme } = useTheme();
  const changeTheme = () => setTheme(theme == "dark" ? "light" : "dark");
  return (
    <Button size={"icon"} variant={"default"} onClick={changeTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  );
}

export { ThemeButton };
