import { useEffect, useRef } from 'react';
import {
  Chart,
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Legend,
  Tooltip
} from 'chart.js';
import { Canvas, ChartContainer } from './Canvas';
import { format } from 'date-fns';

Chart.register(
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Legend,
  Tooltip
);

const HourlyAverageChart = ({ data, skipStart = 0 }) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (!data) {
      return;
    }

    const context = canvasRef.current.getContext('2d');
    if (context === null) {
      return;
    }

    const hourlyChartData = {
      labels: data.map((hourly) => {
        return format(new Date(hourly.hour), 'do MMM yyyy, ha');
      }),
      datasets: [
        {
          label: 'Average',
          data: data.map((hourly) => {
            return hourly.average;
          }),
          type: 'line',
          fill: false,
          borderColor: '#9BCFD1',
          backgroundColor: '#9BCFD1'
        },
        {
          label: 'Standard Deviation',
          data: data.map((hourly) => {
            return hourly.standardDeviation;
          }),
          type: 'line',
          fill: false,
          borderColor: '#7A71D1',
          backgroundColor: '#7A71D1'
        }
      ]
    };

    const hourlyDonations = new Chart(context, {
      type: 'bar',
      data: hourlyChartData,
      options: {
        scales: {
          x: {
            // type: 'time',
            // time: {
            //   round: 'day'
            // },
            ticks: {
              display: false
            },
            grid: {
              drawOnChartArea: false
            }
          },
          y: {
            grid: {
              drawBorder: false,
              color: '#d2b88620'
            },
            ticks: {
              callback: function (value, index, values) {
                return '$' + new Intl.NumberFormat().format(value);
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: true
          },
          title: {
            display: true,
            text: 'Donations - Hourly Average'
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (tooltipItem, ) => `$${tooltipItem.formattedValue}`
            }
          }
        }
      }
    });

    return () => hourlyDonations.destroy();
  }, [canvasRef, data, skipStart]);

  return (
    <ChartContainer>
      <Canvas id="hourlyDonations" ref={canvasRef} />
    </ChartContainer>
  )
}

export default HourlyAverageChart;
