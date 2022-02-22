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

const HourlyCountChart = ({ data, skipStart = 0 }) => {
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
          label: 'Count',
          data: data.map((hourly) => {
            return hourly.count;
          }),
          fill: false,
          borderColor: '#ffd1dc',
          backgroundColor: '#ffd1dc'
        }
      ]
    };

    const hourlyDonations = new Chart(context, {
      type: 'bar',
      data: hourlyChartData,
      options: {
        scales: {
          x: {
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
            text: 'Donations - Hourly Count'
          },
          tooltip: {
            enabled: true
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

export default HourlyCountChart;
