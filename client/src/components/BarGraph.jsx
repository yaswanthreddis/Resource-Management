import React, { useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-3';

const BarGraph = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data) return; // Exit early if data is not defined

    const chartInstance = chartRef.current;
    const ctx = chartInstance.chart.ctx;

    const myBarChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          x: {
            type: 'category', // Use category scale for the x-axis
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      myBarChart.destroy(); // Destroy the chart instance before unmounting
    };
  }, [data]);

  return <Bar ref={chartRef} data={data} />;
};

export default BarGraph;
