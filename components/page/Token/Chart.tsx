"use client";

import {
  createChart,
  IChartApi,
  ISeriesApi,
  HistogramData,
  MouseEventParams,
  ChartOptions,
  DeepPartial,
  Time,
} from "lightweight-charts";
import React, { useEffect, useRef } from "react";

// Constants
const TOOLTIP_CONFIG = {
  WIDTH: 96,
  HEIGHT: 80,
  MARGIN: 15,
  COLORS: {
    PRIMARY: "rgba(38, 166, 154, 1)",
    TEXT: "white",
    BACKGROUND: "black",
    UP: "#22C55E",
    DOWN: "#E15151",
  },
} as const;

// Types
interface ChartData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  value?: number;
  color?: string;
}

interface TooltipPosition {
  left: number;
  top: number;
}

// Chart configuration
const chartOptions: DeepPartial<ChartOptions> = {
  layout: {
    textColor: "white",
    background: { color: "#34333D" },
  },
  grid: {
    vertLines: {
      color: "rgba(197, 203, 206, 0.5)",
    },
    horzLines: {
      color: "rgba(197, 203, 206, 0.5)",
    },
  },
};

// Helper functions
const generateData = (
  startDate: Date,
  count: number
): { candlestickData: ChartData[]; volumeData: HistogramData[] } => {
  const candlestickData: ChartData[] = [];
  const volumeData: HistogramData[] = [];
  let currentDate = new Date(startDate);
  let lastClose = 100;

  for (let i = 0; i < count; i++) {
    const time = currentDate.toISOString().split("T")[0];

    const open = lastClose + (Math.random() - 0.5) * 5;
    const high = open + Math.random() * 5;
    const low = open - Math.random() * 5;
    const close = low + Math.random() * (high - low);

    candlestickData.push({ time, open, high, low, close });

    const volume = Math.floor(Math.random() * 1000000) + 100000;
    const color =
      close > open ? TOOLTIP_CONFIG.COLORS.UP : TOOLTIP_CONFIG.COLORS.DOWN;
    volumeData.push({ time, value: volume, color });

    lastClose = close;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { candlestickData, volumeData };
};

const formatVolume = (volume: number): string => {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(2)}M`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(2)}K`;
  }
  return volume.toString();
};

const createTooltip = (): HTMLDivElement => {
  const tooltip = document.createElement("div");

  const baseStyles: Partial<CSSStyleDeclaration> = {
    width: `${TOOLTIP_CONFIG.WIDTH}px`,
    height: `${TOOLTIP_CONFIG.HEIGHT}px`,
    position: "absolute",
    display: "none",
    padding: "8px",
    boxSizing: "border-box",
    fontSize: "12px",
    textAlign: "left",
    zIndex: "1000",
    top: "12px",
    left: "12px",
    pointerEvents: "none",
    border: "1px solid",
    borderRadius: "2px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Trebuchet MS", Roboto, Ubuntu, sans-serif',
    background: TOOLTIP_CONFIG.COLORS.BACKGROUND,
    color: TOOLTIP_CONFIG.COLORS.TEXT,
    borderColor: TOOLTIP_CONFIG.COLORS.PRIMARY,
  };

  Object.assign(tooltip.style, baseStyles);
  return tooltip;
};

const calculateTooltipPosition = (
  point: { x: number; y: number },
  containerDimensions: { width: number; height: number }
): TooltipPosition => {
  let left = point.x + TOOLTIP_CONFIG.MARGIN;
  if (left > containerDimensions.width - TOOLTIP_CONFIG.WIDTH) {
    left = point.x - TOOLTIP_CONFIG.MARGIN - TOOLTIP_CONFIG.WIDTH;
  }

  let top = point.y + TOOLTIP_CONFIG.MARGIN;
  if (top > containerDimensions.height - TOOLTIP_CONFIG.HEIGHT) {
    top = point.y - TOOLTIP_CONFIG.HEIGHT - TOOLTIP_CONFIG.MARGIN;
  }

  return { left, top };
};

// Generate initial data
const { candlestickData: candlestickSeriesData, volumeData: volumeSeriesData } =
  generateData(new Date(2023, 0, 1), 100);

export default function Chart(): JSX.Element {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize chart
    chartRef.current = createChart(chartContainerRef.current, chartOptions);

    // Setup candlestick series
    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: TOOLTIP_CONFIG.COLORS.UP,
      downColor: TOOLTIP_CONFIG.COLORS.DOWN,
      borderVisible: false,
      wickUpColor: TOOLTIP_CONFIG.COLORS.UP,
      wickDownColor: TOOLTIP_CONFIG.COLORS.DOWN,
    });

    candlestickSeriesRef.current.priceScale().applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.4,
      },
    });

    candlestickSeriesRef.current.setData(candlestickSeriesData);

    // Setup volume series
    volumeSeriesRef.current = chartRef.current.addHistogramSeries({
      color: TOOLTIP_CONFIG.COLORS.UP,
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
    });

    volumeSeriesRef.current.priceScale().applyOptions({
      scaleMargins: {
        top: 0.7,
        bottom: 0,
      },
    });

    volumeSeriesRef.current.setData(volumeSeriesData);
    chartRef.current.timeScale().fitContent();

    // Create tooltip
    tooltipRef.current = createTooltip();
    chartContainerRef.current.appendChild(tooltipRef.current);

    // Event handlers
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    const handleCrosshairMove = (param: MouseEventParams) => {
      if (
        !chartContainerRef.current ||
        !tooltipRef.current ||
        !candlestickSeriesRef.current ||
        !volumeSeriesRef.current
      )
        return;

      const isOutOfBounds =
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > chartContainerRef.current.clientWidth ||
        param.point.y < 0 ||
        param.point.y > chartContainerRef.current.clientHeight;

      if (isOutOfBounds) {
        tooltipRef.current.style.display = "none";
        return;
      }

      const candlestickData = param.seriesData.get(
        candlestickSeriesRef.current
      ) as ChartData;
      const volumeData = param.seriesData.get(
        volumeSeriesRef.current
      ) as HistogramData;

      if (!candlestickData) return;

      const price = candlestickData.close;
      const volume = volumeData?.value ?? 0;

      tooltipRef.current.style.display = "block";
      tooltipRef.current.innerHTML = `
          <div style="color: ${TOOLTIP_CONFIG.COLORS.PRIMARY}">ABC Inc.</div>
          <div style="font-size: 24px; margin: 4px 0px; color: ${
            TOOLTIP_CONFIG.COLORS.TEXT
          }">
            ${Math.round(100 * price) / 100}
          </div>
          <div style="color: ${TOOLTIP_CONFIG.COLORS.TEXT}">
            Volume: ${formatVolume(volume)}
          </div>
          <div style="color: ${TOOLTIP_CONFIG.COLORS.TEXT}">
            ${param.time}
          </div>
        `;

      if (!param.point) return;
      const { left, top } = calculateTooltipPosition(param.point, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });

      tooltipRef.current.style.left = `${left}px`;
      tooltipRef.current.style.top = `${top}px`;
    };

    window.addEventListener("resize", handleResize);
    chartRef.current.subscribeCrosshairMove(handleCrosshairMove);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.unsubscribeCrosshairMove(handleCrosshairMove);
        chartRef.current.remove();
      }
      tooltipRef.current?.remove();
    };
  }, []);

  return (
    <div className="w-full h-[600px] p-4 rounded-lg shadow-md">
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
}
