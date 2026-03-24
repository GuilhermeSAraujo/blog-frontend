"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Theme } from "@chakra-ui/react";
import {
  applyColorSchemeToDocument,
  type ColorAppearance,
  readStoredAppearance,
  writeStoredAppearance,
} from "../lib/colorModeStorage";

type ColorModeContextValue = {
  appearance: ColorAppearance;
  setAppearance: (value: ColorAppearance) => void;
};

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

export function useColorMode(): ColorModeContextValue {
  const ctx = useContext(ColorModeContext);
  if (!ctx) {
    throw new Error("useColorMode must be used within ColorModeProvider");
  }
  return ctx;
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearanceState] = useState<ColorAppearance>("dark");

  useLayoutEffect(() => {
    const stored = readStoredAppearance();
    if (stored) {
      setAppearanceState(stored);
      applyColorSchemeToDocument(stored);
    }
  }, []);

  const setAppearance = useCallback((value: ColorAppearance) => {
    setAppearanceState(value);
    writeStoredAppearance(value);
    applyColorSchemeToDocument(value);
  }, []);

  const value = useMemo(
    () => ({ appearance, setAppearance }),
    [appearance, setAppearance]
  );

  return (
    <ColorModeContext.Provider value={value}>
      <Theme appearance={appearance} minH="100vh" position="relative">
        {children}
      </Theme>
    </ColorModeContext.Provider>
  );
}
