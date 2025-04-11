'use client';

import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ColorType, LineStyle } from 'lightweight-charts';

interface ChartData {
  time: number;
  value: number;
}

interface SparklineChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
  color?: string;
}

export default function SparklineChart({ data, width = 164, height = 40, color = '#2563eb' }: SparklineChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return;

    // Create the chart
    const chart = createChart(chartContainerRef.current, {
      width: width,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#999',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: {
        visible: true,
        borderVisible: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        visible: true,
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        },
      },
      crosshair: {
        vertLine: {
          color: '#999',
          width: 1,
          style: LineStyle.Dashed,
          visible: true,
          labelVisible: true,
        },
        horzLine: {
          visible: true,
          labelVisible: true,
        },
      },
      handleScroll: false,
      handleScale: false,
    });

    chartRef.current = chart;

    // Create the series
    const mainSeries = chart.addCandlestickSeries({
      upColor: color,
      downColor: color,
      borderVisible: false,
      wickVisible: false,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    });

    // Transform the data for candlestick series
    const transformedData = data.map(item => ({
      time: item.time,
      open: item.value,
      high: item.value,
      low: item.value,
      close: item.value
    }));

    // Set the data
    mainSeries.setData(transformedData);

    // Fit the content
    chart.timeScale().fitContent();

    // Add price tooltip
    const container = chartContainerRef.current;
    const toolTipWidth = 100;
    const toolTipHeight = 40;

    const toolTip = document.createElement('div');
    toolTip.style.position = 'absolute';
    toolTip.style.display = 'none';
    toolTip.style.padding = '8px';
    toolTip.style.boxSizing = 'border-box';
    toolTip.style.fontSize = '12px';
    toolTip.style.textAlign = 'left';
    toolTip.style.zIndex = '1000';
    toolTip.style.top = '12px';
    toolTip.style.left = '12px';
    toolTip.style.pointerEvents = 'none';
    toolTip.style.border = '1px solid rgba(0, 0, 0, 0.1)';
    toolTip.style.borderRadius = '4px';
    toolTip.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    toolTip.style.color = '#333';
    toolTip.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
    container.appendChild(toolTip);

    chart.subscribeCrosshairMove(param => {
      if (!param.point || !param.time || param.point.x < 0 || param.point.x > width || param.point.y < 0 || param.point.y > height) {
        toolTip.style.display = 'none';
        return;
      }

      const price = param.seriesPrices.get(mainSeries);
      if (typeof price !== 'number') {
        toolTip.style.display = 'none';
        return;
      }

      const date = new Date(param.time * 1000);
      const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      toolTip.style.display = 'block';
      toolTip.innerHTML = `
        <div style="font-size: 10px; color: #666;">${dateStr} ${timeStr}</div>
        <div style="font-size: 14px; color: #333; margin-top: 4px;">$${price.toFixed(2)}</div>
      `;
    });

    return () => {
      chart.remove();
      if (container && toolTip) {
        container.removeChild(toolTip);
      }
    };
  }, [data, width, height, color]);

  return <div ref={chartContainerRef} />;
} 