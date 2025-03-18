/////////    1    begin    /////////
// Состояние приложения
const state = {
  selectedTasks: new Set(), // ID выбранных для маршрута задач
  tasks: [] // Все задачи
};

// Инициализация приложения
async function init() {
  await loadTasks(); // Загрузка задач с сервера
  setupEventListeners(); // Настройка обработчиков событий
}

// Загрузка задач с сервера
async function loadTasks() {
  try {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    state.tasks = data;
    renderTasks();
  } catch (error) {
    console.error('Ошибка загрузки задач:', error);
    alert('Не удалось загрузить задачи');
  }
}

// Отображение задач в сетке
function renderTasks() {
  const grid = document.querySelector('.tasks-grid');
  grid.innerHTML = '';

  state.tasks.forEach(task => {
    const taskElement = `
      <div class="task-card status-${task.result}" data-id="${task.id}">
        <div class="task-header">
          <input type="checkbox" ${state.selectedTasks.has(task.id) ? 'checked' : ''}>
          <h3>${task.name}</h3>
          <span class="task-status">${getStatusLabel(task.result)}</span>
        </div>
        <div class="task-body">
          <p class="address">${task.address}</p>
          <p class="key-info">Ключ в коробке №${task.key_box}</p>
        </div>
        <div class="task-actions">
          <button class="btn route-btn">Маршрут</button>
          <button class="btn complete-btn">Завершить</button>
        </div>
      </div>
    `;
    grid.insertAdjacentHTML('beforeend', taskElement);
  });
}

// Обработчик выбора задач для маршрута
function handleTaskSelection(e) {
  const checkbox = e.target;
  const taskId = checkbox.closest('.task-card').dataset.id;
  
  if (checkbox.checked) {
    state.selectedTasks.add(taskId);
  } else {
    state.selectedTasks.delete(taskId);
  }
}

// Построение маршрута в Яндекс.Навигаторе
function buildYandexRoute() {
  const selectedAddresses = state.tasks
    .filter(task => state.selectedTasks.has(task.id))
    .map(task => encodeURIComponent(task.address));

  if (selectedAddresses.length === 0) {
    alert('Выберите хотя бы одну задачу!');
    return;
  }

  const url = `https://yandex.ru/navi/?route=${selectedAddresses.join(',')}`;
  window.open(url, '_blank');
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', init);
/////////    1    end    /////////

/////////    2    begin    /////////
// Отправка отчета
async function submitReport(formData) {
  try {
    // Отправка данных на сервер
    const response = await fetch('/api/reports', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Ошибка сервера');
    
    // Отправка в Telegram
    await sendToTelegram(formData);
    
    // Обновление интерфейса
    await loadTasks();
    closeModal();
    
  } catch (error) {
    console.error('Ошибка отправки отчета:', error);
    alert('Ошибка отправки отчета!');
  }
}

// Отправка в Telegram через API бота
async function sendToTelegram(formData) {
  const chatId = 'ВАШ_CHAT_ID';
  const botToken = 'ВАШ_BOT_TOKEN';
  
  const text = `Новый отчет:\n${formData.get('comment')}`;
  
  // Основное сообщение
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      chat_id: chatId,
      text: text
    })
  });

  // Отправка медиафайлов
  const files = formData.getAll('media');
  for (const file of files) {
    const form = new FormData();
    form.append('document', file);
    
    await fetch(`https://api.telegram.org/bot${botToken}/sendDocument?chat_id=${chatId}`, {
      method: 'POST',
      body: form
    });
  }
}
/////////    2    end    /////////

/////////    3    begin    /////////
// Открытие модального окна
function openModal(taskId) {
  const modal = document.querySelector('.modal-overlay');
  const task = state.tasks.find(t => t.id === taskId);
  
  // Заполнение данных
  modal.querySelector('.task-title').textContent = task.name;
  modal.querySelector('.task-address').textContent = task.address;
  modal.style.display = 'flex';

  // Сброс предыдущих данных
  modal.querySelector('form').reset();
  modal.querySelector('.postponed-date').classList.add('hidden');
}

// Закрытие модального окна
function closeModal() {
  document.querySelector('.modal-overlay').style.display = 'none';
}

// Обработчик изменения статуса
function handleStatusChange(e) {
  const isPostponed = e.target.value === 'postponed';
  document.querySelector('.postponed-date').classList.toggle('hidden', !isPostponed);
}

// Сбор данных формы
function getFormData() {
  const form = document.querySelector('#report-form');
  const formData = new FormData(form);
  
  formData.append('date', new Date().toISOString());
  
  // Валидация
  if (!formData.get('status')) {
    alert('Выберите статус задачи!');
    return null;
  }
  
  return formData;
}
/////////    3    end    /////////

/////////    4    begin    /////////

function setupEventListeners() {
  // Выбор задач
  document.querySelector('.tasks-grid').addEventListener('change', e => {
    if (e.target.matches('input[type="checkbox"]')) {
      handleTaskSelection(e);
    }
  });

  // Кнопки маршрута
  document.querySelector('.tasks-grid').addEventListener('click', e => {
    if (e.target.closest('.route-btn')) {
      buildYandexRoute();
    }
  });

  // Кнопки завершения
  document.querySelector('.tasks-grid').addEventListener('click', e => {
    if (e.target.closest('.complete-btn')) {
      const taskId = e.target.closest('.task-card').dataset.id;
      openModal(taskId);
    }
  });

  // Форма отчета
  document.querySelector('#report-form').addEventListener('submit', async e => {
    e.preventDefault();
    const formData = getFormData();
    if (formData) await submitReport(formData);
  });

  // Закрытие модального
  document.querySelector('.modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget || e.target.matches('.cancel')) {
      closeModal();
    }
  });

  // Изменение статуса
  document.querySelector('.status-select').addEventListener('change', handleStatusChange);
}

/////////    4    end    /////////

// Открытие/закрытие меню
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.add('active');
});

document.querySelector('.menu-close').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.remove('active');
});

// Обработка статуса в модальном окне
document.querySelector('.status-select').addEventListener('change', function() {
    const dateField = document.querySelector('.postponed-date');
    this.value === 'postponed' 
        ? dateField.classList.remove('hidden')
        : dateField.classList.add('hidden');
});

// Открытие модального окна
document.querySelectorAll('.complete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.modal-overlay').style.display = 'flex';
    });
});

// Закрытие модального окна
document.querySelector('.cancel').addEventListener('click', () => {
    document.querySelector('.modal-overlay').style.display = 'none';
});

// Отправка формы
document.getElementById('report-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Здесь логика отправки данных
    alert('Отчёт отправлен!');
    this.reset();
    document.querySelector('.modal-overlay').style.display = 'none';
});
