async function loadTasks() {
    const response = await fetch('tasks.json?cacheBust=' + Date.now());
    const tasks = await response.json();

    const tbody = document.getElementById('task-body');
    tbody.innerHTML = ''; // Clear old rows

    for (const task of tasks) {
        if (task.IsNotWorking) continue;

        const row = document.createElement('tr');

        const priceCell = document.createElement('td');
        priceCell.textContent = task.Price % 1 === 0 ? task.Price.toFixed(0) : task.Price;
        row.appendChild(priceCell);

        const taskCell = document.createElement('td');
        const link = task.TaskLink || "#";
        const name = task.TaskName || "(No Name)";
        const a = document.createElement('a');
        a.href = link;
        a.target = '_blank';
        a.textContent = name;
        taskCell.appendChild(a);
        row.appendChild(taskCell);

        tbody.appendChild(row);
    }
}
window.onload = loadTasks;
