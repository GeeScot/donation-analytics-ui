import { useEffect, useRef, useState } from 'react';
import {
  Chart,
  LineController,
  BarController,
  ScatterController,
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
import ZoomPlugin from 'chartjs-plugin-zoom';
import styled from 'styled-components';

Chart.register(
  LineController,
  BarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Legend,
  Tooltip,
  ZoomPlugin
);

const DonationsScatterChart = ({ data }) => {
  const canvasRef = useRef();
  const [chart, setChart] = useState(null);
  const max = data.map(x => x.amount).sort((a, b) => b - a)[0];

  useEffect(() => {
    if (!data) {
      return;
    }

    const context = canvasRef.current.getContext('2d');
    if (context === null) {
      return;
    }

    const allDonationsData = {
      labels: data.map((donation) => {
        return format(new Date(donation.completedAt), 'do MMM yyyy, ha');
      }),
      datasets: [
        {
          label: 'Donation',
          data: data.map((donation, i) => {
            return {
              x: i,
              y: donation.amount
            };
          }),
          fill: false,
          borderColor: '#00000040',
          backgroundColor: '#ffd1dc'
        }
      ]
    };

    const allDonations = new Chart(context, {
      type: 'scatter',
      data: allDonationsData,
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
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Donations - All'
          },
          tooltip: {
            enabled: true,
            callbacks: {
              beforeLabel: (tooltipItem) => {
                const donation = data[tooltipItem.dataIndex];
                return `${donation?.name} (${format(new Date(donation?.completedAt), 'do MMM @ HH:mm')})`;
              },
              label: (tooltipItem) => {
                return `$${tooltipItem.formattedValue}`;
              }
            },
            usePointStyle: true,
            labelPointStyle: function(context) {
                return {
                    pointStyle: 'triangle',
                    rotation: 0
                };
            }
          },
          zoom: {
            limits: {
              x: { min: 0, max: (data.length) },
              y: { min: 0, max: (max + 200) }
            },
            pan: {
              enabled: true,
              mode: 'xy',
              threshold: 0
            },
            zoom: {
              wheel: {
                enabled: true
              }
            }
          }
        }
      }
    });

    setChart(allDonations);

    return () => allDonations.destroy();
  }, [canvasRef, setChart, data, max]);

  return (
    <ChartContainer>
      <Canvas id="scatterChart" ref={canvasRef} />
      <Button onClick={() => chart?.resetZoom()}>Reset Zoom</Button>
    </ChartContainer>
  )
}

export default DonationsScatterChart;

const Button = styled.button`

  @media print {
    display: none;
  }
`;
