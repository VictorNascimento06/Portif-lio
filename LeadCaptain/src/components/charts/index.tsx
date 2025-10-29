'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface LeadsByDayChartProps {
  data: Array<{
    date: string
    leads: number
    visitors: number
  }>
}

export function LeadsByDayChart({ data }: LeadsByDayChartProps) {
  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.date)
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    }),
    datasets: [
      {
        label: 'Leads',
        data: data.map(item => item.leads),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Visitantes',
        data: data.map(item => item.visitors),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: false,
        yAxisID: 'y1',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Leads'
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Visitantes'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  return <Line data={chartData} options={options} />
}

interface ConversionRateChartProps {
  data: Array<{
    date: string
    leads: number
    visitors: number
  }>
}

export function ConversionRateChart({ data }: ConversionRateChartProps) {
  const conversionRates = data.map(item => 
    item.visitors > 0 ? ((item.leads / item.visitors) * 100) : 0
  )

  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.date)
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    }),
    datasets: [
      {
        label: 'Taxa de Conversão (%)',
        data: conversionRates,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Taxa de Conversão (%)'
        },
        ticks: {
          callback: function(value: any) {
            return value + '%'
          }
        }
      },
    },
  }

  return <Bar data={chartData} options={options} />
}

interface FunnelChartProps {
  data: {
    visitors: number
    interactions: number
    leads: number
    conversions: number
  }
}

export function FunnelChart({ data }: FunnelChartProps) {
  const chartData = {
    labels: ['Visitantes', 'Interações', 'Leads', 'Conversões'],
    datasets: [
      {
        label: 'Funil de Conversão',
        data: [data.visitors, data.interactions, data.leads, data.conversions],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantidade'
        }
      },
    },
  }

  return <Bar data={chartData} options={options} />
}