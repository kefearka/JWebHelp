import { Notifier } from '../components/notifications.js';

export class ErrorHandler {
  static setupGlobalHandlers() {
    window.addEventListener('error', (event) => {
      this.handle(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handle(event.reason);
    });
  }

  static handle(error) {
    console.error('Error:', error);
    Notifier.show(error.message || 'Ошибка приложения', 'error');
  }
}