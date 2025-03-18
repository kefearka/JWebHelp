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