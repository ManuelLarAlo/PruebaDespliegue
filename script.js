let calendar;
let nextId = 1;
let selectedDate;
let ignoreNextClick = false;

document.addEventListener('DOMContentLoaded', async function() {
	const calendarEl = document.getElementById('calendar');

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true,
    locale: 'es',
    
    dateClick: function(info) {
    	selectedDate = info.dateStr;
      
      document.getElementById('taskStart').value = `${info.dateStr}T08:00`;
      document.getElementById('taskEnd').value = `${info.dateStr}T10:00`;
      
      document.getElementById('taskModal').style.display = 'block';
      document.getElementById('overlay').style.display = 'block';
      document.body.style.overflow = 'hidden';
    },
    eventClick: function(info) {
    	const event = info.event;
      
      document.getElementById('detailTitle').textContent = event.title; 
      document.getElementById('detailDesc').textContent = event.extendedProps.descripcion || '(sin descripción)';
      document.getElementById('detailStart').textContent = new Date(event.start).toLocaleString();
      document.getElementById('detailEnd').textContent = event.end ? new Date(event.end).toLocaleString(): '(sin hora de fin)';
      document.getElementById('detailPriority').textContent = event.extendedProps.prioridad || '(sin prioridad)';
			document.getElementById('detailStatus').textContent = event.extendedProps.status || '(sin estado)';
      
      document.getElementById('taskDetailsModal').style.display = 'block';
      document.getElementById('overlay').style.display = 'block';
      document.body.style.overflow = 'hidden';
      ignoreNextClick = true;
    } 
  });
  calendar.render();
});
document.getElementById('weeklyView').addEventListener('click', () => calendar.changeView('timeGridWeek'));
document.getElementById('monthlyView').addEventListener('click', () => calendar.changeView('dayGridMonth'));
document.getElementById('dailyView').addEventListener('click', () => calendar.changeView('timeGridDay'));
document.getElementById('weeklyListView').addEventListener('click', () => calendar.changeView('listMonth'));

document.getElementById('saveTask').addEventListener('click', function() {
	const title = document.getElementById('taskTitle').value;
  const descripcion = document.getElementById('taskDesc').value;
  const start = document.getElementById('taskStart').value;
  const end = document.getElementById('taskEnd').value;
  const prioridad = document.getElementById('taskPriority').value;
	const status = document.getElementById('taskStatus').value;

  if (!title || !start || !end) {
  	alert("Por favor completa todos los campos obligatorios");
    return;
  }
  
  let color = '#3788d8'; // por defecto

  switch (prioridad) {
    case 'baja':
      color = '#8bc34a'; // verde
      break;
    case 'media':
      color = '#ff9800'; // naranja
      break;
    case 'alta':
      color = '#f44336'; // rojo
      break;
  }
  
  calendar.addEvent({
  	id: nextId++,
    title: title,
    start: start,
    end: end,
    backgroundColor: color,
    borderColor: color,
    extendedProps: {
    	descripcion: descripcion,
      prioridad: prioridad,
      status: status
    }
  });
  document.getElementById('taskModal').style.display = 'none';
      // Limpiar los campos del formulario
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDesc').value = '';
  document.getElementById('taskStart').value = '';
  document.getElementById('taskEnd').value = '';
  document.getElementById('taskPriority').value = 'baja'; // o 'media' si quieres un valor por defecto
  document.getElementById('taskStatus').value = 'pendiente';
  document.getElementById('overlay').style.display = 'none';
  document.body.style.overflow = '';
});

function applyFilters() {
  const selectedPriority = document.getElementById('filterPriority').value;
  const selectedStatus = document.getElementById('filterStatus').value;

  calendar.getEvents().forEach(event => {
    const matchPriority = !selectedPriority || event.extendedProps.prioridad === selectedPriority;
    const matchStatus = !selectedStatus || event.extendedProps.status === selectedStatus;

    if (matchPriority && matchStatus) {
      event.setProp('display', 'auto');
    } else {
      event.setProp('display', 'none');
    }
  });
}

document.getElementById('filterPriority').addEventListener('change', applyFilters);
document.getElementById('filterStatus').addEventListener('change', applyFilters);

function closeModal() {
  document.getElementById('taskModal').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
  document.body.style.overflow = '';
    // Limpiar los campos del formulario
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDesc').value = '';
  document.getElementById('taskStart').value = '';
  document.getElementById('taskEnd').value = '';
  document.getElementById('taskPriority').value = 'baja'; // o 'media' si quieres un valor por defecto
  document.getElementById('taskStatus').value = 'pendiente';
}

function closeDetailsModal() {
  document.getElementById('taskDetailsModal').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
  document.body.style.overflow = '';
}

// Asignamos los eventos a los botones
document.getElementById('cancelTask').addEventListener('click', closeModal);
document.getElementById('closeDetails').addEventListener('click', closeDetailsModal);

  // Cerrar modal al hacer clic fuera de él
window.addEventListener('click', function(event) {
  if (ignoreNextClick) {
    ignoreNextClick = false; // Ignoramos solo este clic
    return;
  }

  const modal1 = document.getElementById('taskModal');
  const modal2 = document.getElementById('taskDetailsModal');
  const overlay = document.getElementById('overlay');

  if (overlay.style.display === 'block' && 
      !modal1.contains(event.target) && 
      !modal2.contains(event.target) && 
      event.target !== modal1 && 
      event.target !== modal2) {
    closeModal();
    closeDetailsModal();
  }
});
