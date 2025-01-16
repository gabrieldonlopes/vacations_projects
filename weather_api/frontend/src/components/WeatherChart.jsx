import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Registro dos módulos necessários para o gráfico de linhas
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const WeatherChart = ({ days, avgTemp}) => {
  const data = {
    labels: days, // Rótulos do eixo X
    datasets: [
      {
        data: avgTemp, // Dados do eixo Y
        fill: 'origin',
        backgroundColor: 'rgba(118, 224, 224, 0.6)', // Cor de preenchimento abaixo da linha
        borderColor: 'rgba(75, 192, 192, 1)', // Cor da linha
        pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Cor dos pontos
        pointBorderColor: '#fff', // Cor da borda dos pontos
        pointHoverBackgroundColor: '#fff', // Cor ao passar o mouse sobre os pontos
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)', // Cor da borda ao passar o mouse
        tension: 0.4, // Suavidade da linha (0 = linhas retas)
      },
    ],
  };

  const options = {
    responsive: true,
    
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
        },
        grid: {
          display: false,
        
        },
        ticks: {
          display: false, // Oculta os rótulos do eixo X
        },
      },
      y: {
        min: 0,
        max: 50,
        ticks: {
          display: false, // Oculta os rótulos do eixo Y
        },
        grid: {
          drawTicks: false, // Remove as marcações do eixo Y
          display: false,
        },
        title: {
          display: false, // Oculta o título do eixo Y
        },
        beginAtZero: false,
      },
    },
  };

  return (
  <div>
    <Line data={data} options={options} />
  </div>
  );
};

export default WeatherChart;
