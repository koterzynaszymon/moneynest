import type { ChartOptions } from "chart.js";

export type ChartThemeColors = {
  barFill: string;
  barBorder: string;
  chartColors: string[];
  tick: string;
  grid: string;
  tooltipBg: string;
  tooltipText: string;
};

/** Light-mode fallbacks matching :root in app/globals.css (used before mount / SSR). */
export const FALLBACK_CHART_COLORS: ChartThemeColors = {
  barFill: "hsl(152 60% 45% / 0.25)",
  barBorder: "hsl(152 60% 40%)",
  chartColors: [
    "hsl(152 60% 45%)",
    "hsl(172 55% 42%)",
    "hsl(192 50% 45%)",
    "hsl(42 96% 55%)",
    "hsl(0 72% 58%)",
  ],
  tick: "hsl(220 12% 42%)",
  grid: "hsl(220 16% 88%)",
  tooltipBg: "hsl(220 25% 12%)",
  tooltipText: "hsl(220 30% 98%)",
};

function cssHsl(name: string, alpha?: number): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  if (!value) {
    return alpha == null ? "transparent" : `hsl(0 0% 0% / ${alpha})`;
  }

  return alpha == null ? `hsl(${value})` : `hsl(${value} / ${alpha})`;
}

/** Reads live theme tokens from the DOM (call only in the browser). */
export function getChartThemeColors(): ChartThemeColors {
  return {
    barFill: cssHsl("--chart-1", 0.5),
    barBorder: cssHsl("--chart-1"),
    chartColors: [
      cssHsl("--chart-1"),
      cssHsl("--chart-2"),
      cssHsl("--chart-3"),
      cssHsl("--chart-4"),
      cssHsl("--chart-5"),
    ],
    tick: cssHsl("--muted-foreground"),
    grid: cssHsl("--border"),
    tooltipBg: cssHsl("--foreground"),
    tooltipText: cssHsl("--background"),
  };
}

/** Shared Chart.js options so every chart can match NestLedger text/grid/tooltip colors. */
export function getThemedChartOptions(
  colors: ChartThemeColors,
): ChartOptions<"bar"> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: colors.tick,
        },
      },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        titleColor: colors.tooltipText,
        bodyColor: colors.tooltipText,
      },
    },
    scales: {
      x: {
        ticks: { color: colors.tick },
        grid: { color: colors.grid },
      },
      y: {
        ticks: { color: colors.tick },
        grid: { color: colors.grid },
      },
    },
  };
}

export function getThemedDoughnutChartOptions(
  colors: ChartThemeColors,
): ChartOptions<"doughnut"> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: colors.tick,
        },
      },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        titleColor: colors.tooltipText,
        bodyColor: colors.tooltipText,
      },
    },
  };
}
