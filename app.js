import { apiClient } from './api/client.js';
import { Notifier } from './components/notifications.js';
import { YandexNavigator } from './utils/navigation.js';
import { MediaProcessor } from './utils/media-processor.js';
import { Validator } from './utils/validation.js';
import { ErrorHandler } from './utils/error-handler.js';

class App {
  constructor() {
    this.state = {
      tasks: [],
      selectedTasks: new Set()
    };
    this.init();
  }

  async init() {
    try {
      ErrorHandler.setupGlobalHandlers();
      await this.loadTasks();
      this.setupEventListeners();
    } catch (error) {
      ErrorHandler.handle(error);
    }
  }

  async loadTasks() {
    this.state.tasks = await apiClient.tasks.list();
    this.renderTasks();
  }

  renderTasks() {
    const grid = document.querySelector('.tasks-grid');
    grid.innerHTML = this.state.tasks
      .map(task => `
        <div class="task-card" data-id="${task.id}">
          <h3>${task.name}</h3>
          <p>${task.address}</p>
          <button class="complete-btn">Завершить</button>
        </div>
      `)
      .join('');
  }

  setupEventListeners() {
    document.addEventListener('click', async (event) => {
      if (event.target.classList.contains('complete-btn')) {
        await this.handleCompleteTask(event);
      }
    });
  }

  async handleCompleteTask(event) {
    const taskElement = event.target.closest('.task-card');
    const taskId = taskElement.dataset.id;
    
    try {
      await apiClient.tasks.complete(taskId, {});
      Notifier.show('Задача завершена', 'success');
      await this.loadTasks();
    } catch (error) {
      ErrorHandler.handle(error);
    }
  }
}

new App();