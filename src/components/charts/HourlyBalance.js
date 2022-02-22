import { useEffect, useRef } from 'react';
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip,
  Filler
} from 'chart.js';
import { Canvas, ChartContainer } from './Canvas';
import { format } from 'date-fns';

Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip,
  Filler
);

const HourlyBalanceChart = ({ data, skipStart = 0 }) => {
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
          label: 'Donations',
          data: data.map((hourly) => {
            return hourly.balance;
          }),
          fill: true,
          borderColor: '#ffd1dc',
          backgroundColor: '#ffd1dc66'
        }
      ]
    };

    const hourlyBalanceChart = new Chart(context, {
      type: 'line',
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
              color: '#ffd1dc66'
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
            display: false
          },
          title: {
            display: true,
            text: 'Donations - Hourly Cumulative Total'
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (tooltipItem) => `$${tooltipItem.formattedValue}`
            }
          }
        }
      }
    });

    return () => hourlyBalanceChart.destroy();
  }, [canvasRef, data, skipStart]);

  return (
    <ChartContainer>
      <Canvas id="hourlyBalanceChart" ref={canvasRef} />
    </ChartContainer>
  )
}

export default HourlyBalanceChart;
