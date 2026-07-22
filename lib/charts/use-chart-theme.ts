"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  FALLBACK_CHART_COLORS,
  getChartThemeColors,
  type ChartThemeColors,
} from "@/lib/charts/theme";

/** Keeps chart colors in sync with light/dark theme. */
export function useChartTheme(): ChartThemeColors {
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = useState<ChartThemeColors>(FALLBACK_CHART_COLORS);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setColors(getChartThemeColors());
    });
    return () => cancelAnimationFrame(id);
  }, [resolvedTheme]);

  return colors;
}
