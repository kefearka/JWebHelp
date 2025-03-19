document.addEventListener('DOMContentLoaded', async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('current-date').textContent = today;
        
        const response = await fetch(`/api/tasks?date=${today}`);
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        alert(error.message);
    }
});

function renderTasks(tasks) {
    const container = document.getElementById('tasks-container');
    
    container.innerHTML = tasks.map(task => `
        <div class="task-card" data-id="${task.id}">
            <h3>${task.name}</h3>
            <p>Адрес: ${task.address}</p>
            <p>Коробка с ключом: ${task.key_box || 'не указана'}</p>
            <p>Статус: ${task.result}</p>
        </div>
    `).join('');
}