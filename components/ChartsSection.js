"use client"

import { useEffect, useRef } from "react"

function ChartsSection({ activities }) {
  const progressChartRef = useRef(null)
  const monthlyChartRef = useRef(null)
  const progressChartInstance = useRef(null)
  const monthlyChartInstance = useRef(null)

  useEffect(() => {
    // Cargar Chart.js dinámicamente
    const loadChartJS = async () => {
      if (typeof window !== "undefined" && !window.Chart) {
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/npm/chart.js"
        script.onload = () => {
          createCharts()
        }
        document.head.appendChild(script)
      } else if (window.Chart) {
        createCharts()
      }
    }

    loadChartJS()

    return () => {
      if (progressChartInstance.current) {
        progressChartInstance.current.destroy()
      }
      if (monthlyChartInstance.current) {
        monthlyChartInstance.current.destroy()
      }
    }
  }, [activities])

  const createCharts = () => {
    if (!window.Chart || !activities.length) return

    if (progressChartInstance.current) {
      progressChartInstance.current.destroy()
    }
    if (monthlyChartInstance.current) {
      monthlyChartInstance.current.destroy()
    }

    createProgressChart()
    createMonthlyChart()
  }

  const createProgressChart = () => {
    const ctx = progressChartRef.current?.getContext("2d")
    if (!ctx) return

    // Datos por ciclo
    const cycleData = {}
    activities.forEach((activity) => {
      if (!cycleData[activity.cycle]) {
        cycleData[activity.cycle] = 0
      }
      cycleData[activity.cycle] += Number.parseFloat(activity.hours)
    })

    const cycles = Object.keys(cycleData).sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
    const hours = cycles.map((cycle) => cycleData[cycle])
    const goals = cycles.map(() => 60) // Meta de 60 horas por ciclo

    progressChartInstance.current = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels: cycles.map((cycle) => `Ciclo ${cycle}`),
        datasets: [
          {
            label: "Horas Completadas",
            data: hours,
            backgroundColor: "rgba(79, 70, 229, 0.8)",
            borderColor: "rgba(79, 70, 229, 1)",
            borderWidth: 1,
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: "Meta (60h)",
            data: goals,
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 2,
            borderDash: [5, 5],
            type: "line",
            fill: false,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "📊 Progreso por Ciclo",
            font: {
              size: 18,
              weight: "bold",
            },
            color: "#1f2937",
            padding: 20,
          },
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Horas",
              font: {
                weight: "bold",
              },
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    })
  }

  const createMonthlyChart = () => {
    const ctx = monthlyChartRef.current?.getContext("2d")
    if (!ctx) return

    // Datos por mes
    const monthlyData = {}
    activities.forEach((activity) => {
      const date = new Date(activity.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0
      }
      monthlyData[monthKey] += Number.parseFloat(activity.hours)
    })

    const months = Object.keys(monthlyData).sort()
    const monthlyHours = months.map((month) => monthlyData[month])

    // Formatear etiquetas de meses
    const monthLabels = months.map((month) => {
      const [year, monthNum] = month.split("-")
      const date = new Date(year, monthNum - 1)
      return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" })
    })

    monthlyChartInstance.current = new window.Chart(ctx, {
      type: "line",
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: "Horas por Mes",
            data: monthlyHours,
            borderColor: "rgba(16, 185, 129, 1)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "rgba(16, 185, 129, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "📈 Tendencia Mensual",
            font: {
              size: 18,
              weight: "bold",
            },
            color: "#1f2937",
            padding: 20,
          },
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Horas",
              font: {
                weight: "bold",
              },
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Mes",
              font: {
                weight: "bold",
              },
            },
            grid: {
              display: false,
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
      },
    })
  }

  // Calcular estadísticas adicionales
  const totalHours = activities.reduce((sum, activity) => sum + Number.parseFloat(activity.hours), 0)
  const totalActivities = activities.length
  const averageHoursPerActivity = totalActivities > 0 ? totalHours / totalActivities : 0

  if (!activities.length) {
    return (
      <section className="charts-section">
        <div className="charts-container">
          <div className="no-data">
            <div className="no-data-icon">📊</div>
            <h3>Estadísticas</h3>
            <p>Registra algunas actividades para ver tus gráficos de progreso y estadísticas detalladas</p>
          </div>
        </div>

        <style jsx>{`
          .charts-section {
            margin-bottom: 2rem;
          }

          .charts-container {
            background-color: var(--background-color);
            border-radius: var(--radius);
            padding: 2rem;
            box-shadow: var(--shadow);
          }

          .no-data {
            text-align: center;
            padding: 3rem 2rem;
            color: var(--text-light);
          }

          .no-data-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }

          .no-data h3 {
            margin-bottom: 0.5rem;
            color: var(--text-color);
            font-size: 1.5rem;
          }

          .no-data p {
            font-size: 1rem;
            line-height: 1.5;
          }
        `}</style>
      </section>
    )
  }

  return (
    <section className="charts-section">
      <div className="charts-container">
        <div className="stats-summary">
          <div className="stat-item">
            <div className="stat-number">{totalHours.toFixed(1)}</div>
            <div className="stat-label">Total de Horas</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{totalActivities}</div>
            <div className="stat-label">Actividades</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{averageHoursPerActivity.toFixed(1)}</div>
            <div className="stat-label">Promedio por Actividad</div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-item">
            <canvas ref={progressChartRef}></canvas>
          </div>
          <div className="chart-item">
            <canvas ref={monthlyChartRef}></canvas>
          </div>
        </div>
      </div>

      <style jsx>{`
        .charts-section {
          margin-bottom: 2rem;
        }

        .charts-container {
          background-color: var(--background-color);
          border-radius: var(--radius);
          padding: 1.5rem;
          box-shadow: var(--shadow);
        }

        .stats-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-light);
          font-weight: 500;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .chart-item {
          height: 350px;
          position: relative;
          background: #fafafa;
          border-radius: 12px;
          padding: 1rem;
        }

        @media (max-width: 768px) {
          .stats-summary {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .charts-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .chart-item {
            height: 300px;
          }

          .stat-number {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .charts-container {
            padding: 1rem;
          }

          .stat-item {
            padding: 0.75rem;
          }

          .chart-item {
            height: 250px;
            padding: 0.75rem;
          }
        }
      `}</style>
    </section>
  )
}

export default ChartsSection
