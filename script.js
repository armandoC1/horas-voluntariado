// Constantes
const HOURS_GOAL = 60
const DATA_FILE_PATH = "volunteer-data.json" // Cambiado para estar en la raíz del proyecto

// Variables globales
let activities = []

// Funciones para exportar e importar datos
function exportToExcel() {
  // Implementación para exportar a Excel
  console.log("Exportar a Excel")
}

function exportDataAsJson() {
  // Implementación para exportar datos como JSON
  console.log("Exportar datos como JSON")
}

function importDataFromJson(file) {
  // Implementación para importar datos desde JSON
  console.log("Importar datos desde JSON")
}

function importFromExcel(file) {
  // Implementación para importar desde Excel
  console.log("Importar desde Excel")
}

// Cargar datos al iniciar
document.addEventListener("DOMContentLoaded", async () => {
  await loadData()
  setupEventListeners()
  setupTimeDisplays()
  updateDashboard()
  updateActivitiesList()
  updateCycleFilter()
})

// Configurar event listeners
function setupEventListeners() {
  // Formulario de registro
  document.getElementById("volunteer-form").addEventListener("submit", handleFormSubmit)

  // Configurar los selectores de tiempo para actualizar los campos ocultos
  setupTimeInputs()

  // Filtro de ciclos
  document.getElementById("filter-cycle").addEventListener("change", (e) => {
    const selectedCycle = e.target.value
    updateActivitiesList()
    updateCycleBadges(selectedCycle)

    if (selectedCycle !== "all") {
      updateCycleDashboard(Number.parseInt(selectedCycle))
    } else {
      updateCycleDashboard(getCurrentCycle())
    }
  })

  // Botón de descarga CSV
  document.getElementById("download-csv").addEventListener("click", downloadActivitiesCSV)

  // Botones específicos para GitHub
  document.getElementById("export-github").addEventListener("click", exportForGitHub)
  document.getElementById("import-github").addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      importFromGitHub(e.target.files[0])
      e.target.value = "" // Resetear para permitir seleccionar el mismo archivo
    }
  })
}

// Configurar los inputs de tiempo en formato 12h
function setupTimeInputs() {
  // Configurar el input de hora de entrada
  const startHour = document.getElementById("start-time-hour")
  const startMinute = document.getElementById("start-time-minute")
  const startAmPm = document.getElementById("start-time-ampm")
  const startTimeHidden = document.getElementById("start-time")

  // Configurar el input de hora de salida
  const endHour = document.getElementById("end-time-hour")
  const endMinute = document.getElementById("end-time-minute")
  const endAmPm = document.getElementById("end-time-ampm")
  const endTimeHidden = document.getElementById("end-time")

  // Función para actualizar los campos ocultos
  function updateHiddenFields() {
    // Convertir hora de entrada de 12h a 24h
    startTimeHidden.value = convert12hTo24h(startHour.value, startMinute.value, startAmPm.value)

    // Convertir hora de salida de 12h a 24h
    endTimeHidden.value = convert12hTo24h(endHour.value, endMinute.value, endAmPm.value)
  }

  // Agregar event listeners a todos los selectores
  startHour.addEventListener("change", updateHiddenFields)
  startMinute.addEventListener("change", updateHiddenFields)
  startAmPm.addEventListener("change", updateHiddenFields)
  endHour.addEventListener("change", updateHiddenFields)
  endMinute.addEventListener("change", updateHiddenFields)
  endAmPm.addEventListener("change", updateHiddenFields)

  // Inicializar los campos ocultos
  updateHiddenFields()
}

// Convertir hora de formato 12h a 24h
function convert12hTo24h(hour, minute, ampm) {
  let hourInt = Number.parseInt(hour, 10)

  // Convertir a formato 24h
  if (ampm === "PM" && hourInt < 12) {
    hourInt += 12
  } else if (ampm === "AM" && hourInt === 12) {
    hourInt = 0
  }

  // Formatear la hora y minutos con ceros a la izquierda
  const hourStr = hourInt.toString().padStart(2, "0")
  const minuteStr = minute.padStart(2, "0")

  return `${hourStr}:${minuteStr}`
}

// Convertir hora de formato 24h a componentes de 12h
function convert24hTo12hComponents(timeString) {
  if (!timeString) return { hour: "12", minute: "00", ampm: "AM" }

  const [hours, minutes] = timeString.split(":")
  let hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? "PM" : "AM"

  // Convertir a formato 12h
  if (hour === 0) {
    hour = 12
  } else if (hour > 12) {
    hour = hour - 12
  }

  return {
    hour: hour.toString(),
    minute: minutes,
    ampm: ampm,
  }
}

// Configurar los displays de tiempo en formato 12h
function setupTimeDisplays() {
  const startTimeInput = document.getElementById("start-time")
  const endTimeInput = document.getElementById("end-time")
  const startTimeDisplay = document.getElementById("start-time-display")
  const endTimeDisplay = document.getElementById("end-time-display")

  // Función para actualizar los displays
  function updateTimeDisplays() {
    if (startTimeInput.value) {
      startTimeDisplay.textContent = formatTime12Hour(startTimeInput.value)
    }
    if (endTimeInput.value) {
      endTimeDisplay.textContent = formatTime12Hour(endTimeInput.value)
    }
  }

  // Eventos para actualizar los displays cuando cambian los inputs
  startTimeInput.addEventListener("change", updateTimeDisplays)
  startTimeInput.addEventListener("input", updateTimeDisplays)
  endTimeInput.addEventListener("change", updateTimeDisplays)
  endTimeInput.addEventListener("input", updateTimeDisplays)

  // Inicializar con valores por defecto
  if (!startTimeInput.value) startTimeInput.value = "08:00"
  if (!endTimeInput.value) endTimeInput.value = "17:00"

  // Actualizar displays iniciales
  updateTimeDisplays()
}

// Actualizar los botones de ciclo para reflejar la selección
function updateCycleBadges(selectedCycle) {
  document.querySelectorAll(".cycle-badge").forEach((badge) => {
    badge.classList.remove("active")
    if (selectedCycle !== "all" && badge.textContent.includes(`Ciclo ${selectedCycle}:`)) {
      badge.classList.add("active")
    }
  })
}

// Sistema de notificaciones
function showToast(message, type = "info", duration = 3000) {
  const toastContainer = document.getElementById("toast-container")

  const toast = document.createElement("div")
  toast.className = `toast ${type}`

  toast.innerHTML = `
    <div class="toast-content">${message}</div>
    <button class="toast-close">&times;</button>
  `

  toastContainer.appendChild(toast)

  // Configurar el botón de cerrar
  const closeBtn = toast.querySelector(".toast-close")
  closeBtn.addEventListener("click", () => {
    toast.classList.add("hide")
    setTimeout(() => {
      toast.remove()
    }, 300)
  })

  // Auto-cerrar después de la duración especificada
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add("hide")
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove()
        }
      }, 300)
    }
  }, duration)
}

// Cargar datos desde el archivo JSON o localStorage
async function loadData() {
  try {
    // Intentar cargar desde el archivo JSON
    const response = await fetch(DATA_FILE_PATH)

    if (!response.ok) {
      throw new Error(`No se pudo cargar el archivo (${response.status})`)
    }

    const jsonData = await response.json()

    // Validar la estructura del archivo
    if (!jsonData.activities || !Array.isArray(jsonData.activities)) {
      throw new Error("Formato de archivo inválido")
    }

    // Actualizar los datos en memoria
    activities = jsonData.activities

    // Guardar en localStorage como respaldo
    saveToLocalStorage()

    // Mostrar mensaje de éxito
    if (activities.length > 0) {
      const lastUpdateDate = new Date(jsonData.lastUpdate)
      const formattedDate = lastUpdateDate.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      showToast(`Datos cargados. Última actualización: ${formattedDate}`, "success")
    }
  } catch (error) {
    console.error("Error al cargar datos:", error)

    // Si hay un error, intentar cargar desde localStorage
    loadFromLocalStorage()

    if (activities.length > 0) {
      showToast("Usando datos almacenados localmente", "info")
    } else {
      showToast("No se encontraron datos. Comenzando con un registro vacío.", "info")
    }
  }
}

// Guardar datos en localStorage como respaldo
function saveToLocalStorage() {
  try {
    localStorage.setItem("volunteerActivities", JSON.stringify(activities))
    localStorage.setItem("volunteerDataLastUpdate", new Date().toISOString())
  } catch (error) {
    console.error("Error al guardar en localStorage:", error)
  }
}

// Cargar datos desde localStorage
function loadFromLocalStorage() {
  try {
    const storedActivities = localStorage.getItem("volunteerActivities")
    if (storedActivities) {
      activities = JSON.parse(storedActivities)
    }
  } catch (error) {
    console.error("Error al cargar desde localStorage:", error)
    activities = []
  }
}

// Manejar envío del formulario
function handleFormSubmit(e) {
  e.preventDefault()

  // Obtener valores del formulario
  const activityName = document.getElementById("activity-name").value
  const activityDate = document.getElementById("activity-date").value
  const startTime = document.getElementById("start-time").value
  const endTime = document.getElementById("end-time").value
  const location = document.getElementById("location").value
  const cycle = Number.parseInt(document.getElementById("cycle").value)
  const manualHoursInput = document.getElementById("manual-hours").value

  // Determinar horas: usar manual si está disponible, de lo contrario calcular
  let hours
  if (manualHoursInput && !isNaN(Number.parseFloat(manualHoursInput))) {
    hours = Number.parseFloat(manualHoursInput)
  } else {
    hours = calculateHours(startTime, endTime)
  }

  const submitButton = document.querySelector("#volunteer-form button[type='submit']")
  const isEditing = submitButton.hasAttribute("data-edit-id")

  if (isEditing) {
    // Estamos editando una actividad existente
    const editId = Number.parseInt(submitButton.dataset.editId)
    const activityIndex = activities.findIndex((a) => a.id === editId)

    if (activityIndex !== -1) {
      activities[activityIndex] = {
        ...activities[activityIndex],
        name: activityName,
        date: activityDate,
        startTime,
        endTime,
        location,
        cycle,
        hours,
        manualHours: manualHoursInput ? true : false,
      }

      showToast("Actividad actualizada correctamente", "success")
    }

    // Restaurar el botón a su estado original
    submitButton.textContent = "Guardar Actividad"
    submitButton.removeAttribute("data-edit-id")
  } else {
    // Crear nueva actividad
    const newActivity = {
      id: Date.now(), // ID único basado en timestamp
      name: activityName,
      date: activityDate,
      startTime,
      endTime,
      location,
      cycle,
      hours,
      manualHours: manualHoursInput ? true : false,
    }

    // Agregar a la lista
    activities.push(newActivity)
    showToast("Actividad registrada correctamente", "success")
  }

  // Guardar y actualizar UI
  saveToLocalStorage()
  updateDashboard()
  updateActivitiesList()
  updateCycleFilter()

  // Resetear formulario
  document.getElementById("volunteer-form").reset()

  // Reiniciar los selectores de tiempo a sus valores predeterminados
  document.getElementById("start-time-hour").value = "8"
  document.getElementById("start-time-minute").value = "00"
  document.getElementById("start-time-ampm").value = "AM"
  document.getElementById("end-time-hour").value = "5"
  document.getElementById("end-time-minute").value = "00"
  document.getElementById("end-time-ampm").value = "PM"

  // Actualizar los campos ocultos
  setupTimeInputs()
}

// Calcular horas entre dos tiempos
function calculateHours(startTime, endTime) {
  const start = new Date(`2000-01-01T${startTime}`)
  const end = new Date(`2000-01-01T${endTime}`)

  // Si la hora de fin es menor que la de inicio, asumimos que es del día siguiente
  let diff = end - start
  if (diff < 0) {
    diff += 24 * 60 * 60 * 1000 // Añadir un día en milisegundos
  }

  // Convertir a horas y redondear a 2 decimales
  return Math.round((diff / (1000 * 60 * 60)) * 100) / 100
}

// Formatear hora en formato 12 horas
function formatTime12Hour(timeString) {
  if (!timeString) return ""

  const [hours, minutes] = timeString.split(":")
  let hour = Number.parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"

  hour = hour % 12
  hour = hour ? hour : 12 // 0 debe ser 12 en formato 12 horas

  // Asegurar que los minutos tengan dos dígitos
  const formattedMinutes = minutes.padStart(2, "0")

  return `${hour}:${formattedMinutes} ${ampm}`
}

// Actualizar dashboard con estadísticas
function updateDashboard() {
  // Encontrar el ciclo actual (el más alto)
  const currentCycle = getCurrentCycle()

  // Actualizar ciclo actual en UI
  document.getElementById("current-cycle").textContent = currentCycle || "-"

  // Calcular horas completadas en el ciclo actual
  const hoursCompleted = getHoursForCycle(currentCycle)
  document.getElementById("hours-completed").textContent = hoursCompleted.toFixed(1)

  // Calcular horas restantes
  const hoursRemaining = Math.max(0, HOURS_GOAL - hoursCompleted)
  document.getElementById("hours-remaining").textContent = hoursRemaining.toFixed(1)

  // Actualizar barra de progreso
  const progressPercentage = Math.min(100, (hoursCompleted / HOURS_GOAL) * 100)
  document.getElementById("hours-progress").style.width = `${progressPercentage}%`

  // Actualizar lista de ciclos
  updateCyclesList()
}

// Obtener el ciclo actual (el más alto)
function getCurrentCycle() {
  if (activities.length === 0) return null
  return Math.max(...activities.map((activity) => activity.cycle))
}

// Obtener todos los ciclos únicos
function getAllCycles() {
  if (activities.length === 0) return []
  return [...new Set(activities.map((activity) => activity.cycle))].sort((a, b) => a - b)
}

// Calcular horas para un ciclo específico
function getHoursForCycle(cycle) {
  if (!cycle) return 0
  return activities
    .filter((activity) => activity.cycle === cycle)
    .reduce((total, activity) => total + activity.hours, 0)
}

// Actualizar la función updateCyclesList para hacer los botones funcionales
function updateCyclesList() {
  const cycleList = document.getElementById("cycle-list")
  cycleList.innerHTML = ""

  const cycles = getAllCycles()
  const currentCycle = getCurrentCycle()
  const selectedCycle =
    document.getElementById("filter-cycle").value !== "all"
      ? Number.parseInt(document.getElementById("filter-cycle").value)
      : currentCycle

  cycles.forEach((cycle) => {
    const hours = getHoursForCycle(cycle)

    const cycleElement = document.createElement("button")
    cycleElement.className = `cycle-badge ${cycle === selectedCycle ? "active" : ""}`
    cycleElement.textContent = `Ciclo ${cycle}: ${hours.toFixed(1)}h`
    cycleElement.setAttribute("aria-label", `Ver ciclo ${cycle}`)
    cycleElement.addEventListener("click", () => {
      // Actualizar el filtro
      document.getElementById("filter-cycle").value = cycle

      // Actualizar la UI para mostrar este ciclo como activo
      document.querySelectorAll(".cycle-badge").forEach((badge) => {
        badge.classList.remove("active")
      })
      cycleElement.classList.add("active")

      // Actualizar la vista del dashboard para mostrar este ciclo
      updateCycleDashboard(cycle)

      // Actualizar la lista de actividades
      updateActivitiesList()

      // Mostrar notificación
      showToast(`Mostrando información del Ciclo ${cycle}`, "info")
    })

    cycleList.appendChild(cycleElement)
  })
}

// Nueva función para actualizar el dashboard con el ciclo seleccionado
function updateCycleDashboard(cycleId) {
  // Actualizar el título del ciclo actual
  document.getElementById("current-cycle").textContent = cycleId || "-"

  // Calcular horas completadas en el ciclo seleccionado
  const hoursCompleted = getHoursForCycle(cycleId)
  document.getElementById("hours-completed").textContent = hoursCompleted.toFixed(1)

  // Calcular horas restantes
  const hoursRemaining = Math.max(0, HOURS_GOAL - hoursCompleted)
  document.getElementById("hours-remaining").textContent = hoursRemaining.toFixed(1)

  // Actualizar barra de progreso
  const progressPercentage = Math.min(100, (hoursCompleted / HOURS_GOAL) * 100)
  document.getElementById("hours-progress").style.width = `${progressPercentage}%`
}

// Modificar la función updateActivitiesList para mantener la selección de ciclo
function updateActivitiesList() {
  const activitiesList = document.getElementById("activities-list")
  activitiesList.innerHTML = ""

  const filterCycle = document.getElementById("filter-cycle").value

  // Filtrar actividades por ciclo si es necesario
  let filteredActivities = activities
  if (filterCycle !== "all") {
    filteredActivities = activities.filter((activity) => activity.cycle === Number.parseInt(filterCycle))
    updateCycleDashboard(Number.parseInt(filterCycle))
  }

  // Ordenar por fecha (más reciente primero)
  filteredActivities.sort((a, b) => new Date(b.date) - new Date(a.date))

  // Crear filas de la tabla
  filteredActivities.forEach((activity) => {
    const row = document.createElement("tr")

    // Formatear fecha
    const date = new Date(activity.date)
    const formattedDate = date.toLocaleDateString("es-ES")

    // Formatear horas en formato 12h
    const formattedStartTime = formatTime12Hour(activity.startTime)
    const formattedEndTime = formatTime12Hour(activity.endTime)

    row.innerHTML = `
      <td>${formattedDate}</td>
      <td>${activity.name}</td>
      <td>${activity.location}</td>
      <td>${formattedStartTime}</td>
      <td>${formattedEndTime}</td>
      <td>${activity.hours.toFixed(1)}${activity.manualHours ? " *" : ""}</td>
      <td>${activity.cycle}</td>
      <td>
        <button class="btn-edit" data-id="${activity.id}">Editar</button>
        <button class="btn-delete" data-id="${activity.id}">Eliminar</button>
      </td>
    `

    activitiesList.appendChild(row)
  })

  // Agregar event listeners a los botones
  document.querySelectorAll(".btn-delete").forEach((button) => {
    button.addEventListener("click", handleDeleteActivity)
  })

  document.querySelectorAll(".btn-edit").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = Number.parseInt(e.target.getAttribute("data-id"))
      editActivity(id)
    })
  })
}

// Modificar la función updateCycleFilter para mantener la sincronización
function updateCycleFilter() {
  const filterSelect = document.getElementById("filter-cycle")

  // Guardar valor actual
  const currentValue = filterSelect.value

  // Limpiar opciones excepto "Todos"
  while (filterSelect.options.length > 1) {
    filterSelect.remove(1)
  }

  // Agregar opciones para cada ciclo
  const cycles = getAllCycles()
  cycles.forEach((cycle) => {
    const option = document.createElement("option")
    option.value = cycle
    option.textContent = `Ciclo ${cycle}`
    filterSelect.appendChild(option)
  })

  // Restaurar valor si existe, o seleccionar "Todos"
  if (cycles.includes(Number.parseInt(currentValue))) {
    filterSelect.value = currentValue
  }

  // Actualizar la UI para reflejar el ciclo seleccionado
  if (currentValue !== "all") {
    updateCycleDashboard(Number.parseInt(currentValue))
  } else {
    updateCycleDashboard(getCurrentCycle())
  }
}

// Manejar eliminación de actividad
function handleDeleteActivity(e) {
  const id = Number.parseInt(e.target.getAttribute("data-id"))

  if (confirm("¿Estás seguro de que deseas eliminar esta actividad?")) {
    // Filtrar la actividad a eliminar
    activities = activities.filter((activity) => activity.id !== id)

    // Guardar y actualizar UI
    saveToLocalStorage()
    updateDashboard()
    updateActivitiesList()
    updateCycleFilter()

    // Mostrar mensaje
    showToast("Actividad eliminada correctamente", "error")
  }
}

// Modificar la función downloadActivitiesCSV para asegurar que las horas se exporten en formato 12h
function downloadActivitiesCSV() {
  const filterCycle = document.getElementById("filter-cycle").value

  // Obtener actividades filtradas
  let dataToExport = activities
  if (filterCycle !== "all") {
    dataToExport = activities.filter((activity) => activity.cycle === Number.parseInt(filterCycle))
  }

  if (dataToExport.length === 0) {
    showToast("No hay actividades para exportar", "error")
    return
  }

  // Crear encabezados CSV
  let csvContent = "data:text/csv;charset=utf-8,"
  csvContent += "Fecha,Actividad,Lugar,Hora Entrada,Hora Salida,Horas,Ciclo\n"

  // Agregar filas
  dataToExport.forEach((activity) => {
    const date = new Date(activity.date)
    const formattedDate = date.toLocaleDateString("es-ES")
    const formattedStartTime = formatTime12Hour(activity.startTime)
    const formattedEndTime = formatTime12Hour(activity.endTime)

    const row = [
      formattedDate,
      activity.name,
      activity.location,
      formattedStartTime,
      formattedEndTime,
      activity.hours.toFixed(1),
      activity.cycle,
    ]

    // Escapar comas en los campos de texto
    const escapedRow = row.map((field) => {
      if (typeof field === "string" && field.includes(",")) {
        return `"${field}"`
      }
      return field
    })

    csvContent += escapedRow.join(",") + "\n"
  })

  // Crear elemento de descarga
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)

  // Nombre del archivo
  const fileName =
    filterCycle !== "all" ? `horas_voluntariado_ciclo_${filterCycle}.csv` : "horas_voluntariado_todos_ciclos.csv"

  link.setAttribute("download", fileName)

  // Simular clic y eliminar
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  showToast("Archivo CSV descargado correctamente", "success")
}

// Exportar datos para GitHub
function exportForGitHub() {
  try {
    // Crear un objeto con todos los datos
    const exportData = {
      activities: activities,
      lastUpdate: new Date().toISOString(),
      version: "1.0",
    }

    // Crear un objeto Blob con los datos formateados
    const dataStr = JSON.stringify(exportData, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })

    // Crear URL para el blob
    const url = URL.createObjectURL(blob)

    // Crear elemento de descarga
    const link = document.createElement("a")
    link.href = url
    link.download = "volunteer-data.json"

    // Simular clic y eliminar
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showToast("Archivo JSON para GitHub generado. Reemplaza el archivo en tu repositorio.", "success")
  } catch (error) {
    console.error("Error al exportar datos para GitHub:", error)
    showToast("Error al generar el archivo JSON", "error")
  }
}

// Importar datos desde GitHub
function importFromGitHub(file) {
  const reader = new FileReader()

  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result)

      // Validar la estructura del archivo
      if (!importedData.activities || !Array.isArray(importedData.activities)) {
        throw new Error("Formato de archivo inválido")
      }

      // Preguntar al usuario si desea reemplazar o añadir
      const shouldReplace = confirm(
        '¿Deseas reemplazar los datos existentes? Selecciona "Cancelar" para añadir a los datos actuales.',
      )

      if (shouldReplace) {
        activities = importedData.activities
      } else {
        // Combinar actividades, evitando duplicados por ID
        const existingIds = new Set(activities.map((a) => a.id))
        const newActivities = importedData.activities.filter((a) => !existingIds.has(a.id))
        activities = [...activities, ...newActivities]
      }

      // Guardar en localStorage como respaldo
      saveToLocalStorage()

      // Actualizar UI
      updateDashboard()
      updateActivitiesList()
      updateCycleFilter()

      showToast(`${importedData.activities.length} actividades importadas correctamente`, "success")
    } catch (error) {
      console.error("Error al importar archivo:", error)
      showToast("Error al importar el archivo JSON", "error")
    }
  }

  reader.readAsText(file)
}

// Función para exportar a Excel
window.exportToExcel = () => {
  // Verificar si hay actividades para exportar
  const filterCycle = document.getElementById("filter-cycle").value

  // Obtener actividades filtradas
  let dataToExport = activities
  if (filterCycle !== "all") {
    dataToExport = dataToExport.filter((activity) => activity.cycle === Number.parseInt(filterCycle))
  }

  if (dataToExport.length === 0) {
    showToast("No hay actividades para exportar", "error")
    return
  }

  // Crear un libro de trabajo
  const wb = window.XLSX.utils.book_new()

  // Preparar los datos para el formato de Excel
  const data = [["Fecha", "Actividad", "Lugar", "Hora Entrada", "Hora Salida", "Horas", "Ciclo"]]

  dataToExport.forEach((activity) => {
    const date = new Date(activity.date)
    const formattedDate = date.toLocaleDateString("es-ES")
    const formattedStartTime = formatTime12Hour(activity.startTime)
    const formattedEndTime = formatTime12Hour(activity.endTime)

    data.push([
      formattedDate,
      activity.name,
      activity.location,
      formattedStartTime,
      formattedEndTime,
      activity.hours.toFixed(1),
      activity.cycle,
    ])
  })

  // Crear una hoja de cálculo con los datos
  const ws = window.XLSX.utils.aoa_to_sheet(data)

  // Añadir la hoja al libro
  window.XLSX.utils.book_append_sheet(wb, ws, "Horas Voluntariado")

  // Generar el archivo XLSX
  const fileName =
    filterCycle !== "all" ? `horas_voluntariado_ciclo_${filterCycle}.xlsx` : "horas_voluntariado_todos_ciclos.xlsx"

  window.XLSX.writeFile(wb, fileName)

  showToast("Archivo Excel descargado correctamente", "success")
}

// Función para importar desde Excel
window.importFromExcel = (file) => {
  const reader = new FileReader()

  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = window.XLSX.read(data, { type: "array" })

      // Obtener la primera hoja
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]

      // Convertir a JSON
      const jsonData = window.XLSX.utils.sheet_to_json(firstSheet)

      if (jsonData.length === 0) {
        showToast("El archivo no contiene datos", "error")
        return
      }

      // Preguntar al usuario si desea reemplazar o añadir
      const shouldReplace = confirm(
        "¿Deseas reemplazar los datos existentes? Selecciona 'Cancelar' para añadir a los datos actuales.",
      )

      // Procesar los datos importados
      const importedActivities = jsonData.map((row) => {
        // Convertir fecha de Excel a formato ISO
        let date = row.Fecha
        if (typeof date === "number") {
          // Convertir número de Excel a fecha JavaScript
          date = new Date(Math.round((date - 25569) * 86400 * 1000))
          date = date.toISOString().split("T")[0]
        }

        return {
          id: Date.now() + Math.floor(Math.random() * 1000), // Generar ID único
          name: row.Actividad || "",
          date: date || "",
          startTime: row["Hora Entrada"] || "",
          endTime: row["Hora Salida"] || "",
          location: row.Lugar || "",
          cycle: Number.parseInt(row.Ciclo) || 1,
          hours: Number.parseFloat(row.Horas) || 0,
          manualHours: true, // Asumimos que son horas manuales al importar
        }
      })

      if (shouldReplace) {
        activities = importedActivities
      } else {
        activities = [...activities, ...importedActivities]
      }

      // Guardar y actualizar UI
      saveToLocalStorage()
      updateDashboard()
      updateActivitiesList()
      updateCycleFilter()

      showToast(`${importedActivities.length} actividades importadas correctamente`, "success")
    } catch (error) {
      console.error("Error al importar archivo:", error)
      showToast("Error al importar el archivo", "error")
    }
  }

  reader.readAsArrayBuffer(file)
}

// Función para editar una actividad existente
function editActivity(id) {
  const activity = activities.find((a) => a.id === id)
  if (!activity) return

  // Llenar el formulario con los datos de la actividad
  document.getElementById("activity-name").value = activity.name
  document.getElementById("activity-date").value = activity.date
  document.getElementById("location").value = activity.location
  document.getElementById("cycle").value = activity.cycle

  // Configurar los selectores de tiempo con los valores de la actividad
  const startTimeComponents = convert24hTo12hComponents(activity.startTime)
  document.getElementById("start-time-hour").value = startTimeComponents.hour
  document.getElementById("start-time-minute").value = startTimeComponents.minute
  document.getElementById("start-time-ampm").value = startTimeComponents.ampm

  const endTimeComponents = convert24hTo12hComponents(activity.endTime)
  document.getElementById("end-time-hour").value = endTimeComponents.hour
  document.getElementById("end-time-minute").value = endTimeComponents.minute
  document.getElementById("end-time-ampm").value = endTimeComponents.ampm

  // Actualizar los campos ocultos
  document.getElementById("start-time").value = activity.startTime
  document.getElementById("end-time").value = activity.endTime

  if (activity.manualHours) {
    document.getElementById("manual-hours").value = activity.hours
  } else {
    document.getElementById("manual-hours").value = ""
  }

  // Cambiar el botón de guardar para indicar que estamos editando
  const submitButton = document.querySelector("#volunteer-form button[type='submit']")
  submitButton.textContent = "Actualizar Actividad"
  submitButton.dataset.editId = id

  // Desplazarse al formulario
  document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" })
}

// Exponer funciones globalmente para que puedan ser usadas por otros módulos
window.updateDashboard = updateDashboard
window.updateActivitiesList = updateActivitiesList
window.updateCycleFilter = updateCycleFilter
window.formatTime12Hour = formatTime12Hour
window.showToast = showToast
