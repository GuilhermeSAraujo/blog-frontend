"use client";

import { Box, SegmentGroup } from "@chakra-ui/react";
import { useColorMode } from "./ColorModeProvider";

export function ColorModeToggle() {
  const { appearance, setAppearance } = useColorMode();

  return (
    <Box position="fixed" top={4} right={4} zIndex="sticky">
      <SegmentGroup.Root
        aria-label="Color mode"
        value={appearance}
        onValueChange={(d) => {
          const v = d.value;
          if (v === "light" || v === "dark") setAppearance(v);
        }}
      >
        <SegmentGroup.Items
          items={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
        />
      </SegmentGroup.Root>
    </Box>
  );
}
