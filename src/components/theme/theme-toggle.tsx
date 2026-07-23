"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themeLabels = {
  light: "Terang",
  dark: "Gelap",
  system: "Sistem",
} as const;

type ThemeName = keyof typeof themeLabels;

function isThemeName(value: string): value is ThemeName {
  return value in themeLabels;
}

function subscribeToHydration(): () => void {
  return () => {};
}

function getClientSnapshot(): boolean {
  return true;
}

function getServerSnapshot(): boolean {
  return false;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const mounted = useSyncExternalStore(subscribeToHydration, getClientSnapshot, getServerSnapshot);

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled
        aria-label="Memuat pilihan tema"
        className="relative shrink-0"
      >
        <Sun className="size-4" aria-hidden="true" />

        <span className="sr-only">Memuat pilihan tema</span>
      </Button>
    );
  }

  const currentTheme: ThemeName = theme && isThemeName(theme) ? theme : "system";

  function handleThemeChange(value: string) {
    if (isThemeName(value)) {
      setTheme(value);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative shrink-0"
          aria-label={`Tema saat ini: ${themeLabels[currentTheme]}. Ubah tema`}
          title="Ubah tema"
        >
          <Sun
            className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
            aria-hidden="true"
          />

          <Moon
            className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
            aria-hidden="true"
          />

          <span className="sr-only">Ubah tema</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Tampilan</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup value={currentTheme} onValueChange={handleThemeChange}>
          <DropdownMenuRadioItem value="light">
            <Sun aria-hidden="true" />
            Terang
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="dark">
            <Moon aria-hidden="true" />
            Gelap
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="system">
            <Laptop aria-hidden="true" />
            Sistem
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
