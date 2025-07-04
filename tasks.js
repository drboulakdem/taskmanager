async function loadTasks() {
  try {
    const res = await fetch('tasks.json', { cache: 'no-store' });
    const tasks = await res.json();

    const tbody = document.getElementById('task-list');
    tbody.innerHTML = '';

    const activeTasks = tasks.filter(t => !t.IsNotWorking);

    if (activeTasks.length === 0) {
      tbody.innerHTML = '<tr><td colspan="2">No active tasks.</td></tr>';
      return;
    }

    for (const t of activeTasks) {
      const tr = document.createElement('tr');
      const price = Number.isInteger(t.Price) ? t.Price : parseFloat(t.Price).toString();

      const link = t.TaskLink?.trim() || '#';
      const name = t.TaskName?.trim() || '(No Name)';

      tr.innerHTML = `
        <td>${price}</td>
        <td><a href="${link}" target="_blank" rel="noopener noreferrer">${name}</a></td>
      `;

      tbody.appendChild(tr);
    }
  } catch (err) {
    document.getElementById('task-list').innerHTML =
      `<tr><td colspan="2">Error loading tasks: ${err.message}</td></tr>`;
  }
}

loadTasks();
setInterval(loadTasks, 60000); // refresh every minute
