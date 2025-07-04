async function loadTasks(forceReload = false) {
  const tbody = document.getElementById('task-body');
  tbody.innerHTML = "<tr><td colspan='2'>Loading...</td></tr>";

  try {
    const cacheBust = forceReload ? '?cache=' + Date.now() : '';
    const response = await fetch(
      'https://rawcdn.githack.com/drboulakdem/taskmanager/main/tasks.json' + cacheBust,
      { cache: 'no-store' }
    );
    const tasks = await response.json();

    tbody.innerHTML = '';

    for (const task of tasks) {
      if (task.IsNotWorking) continue;

      const row = document.createElement('tr');

      const priceCell = document.createElement('td');
      priceCell.textContent = task.Price % 1 === 0 ? task.Price.toFixed(0) : task.Price;
      row.appendChild(priceCell);

      const nameCell = document.createElement('td');
      const a = document.createElement('a');
      a.href = task.TaskLink || "#";
      a.textContent = task.TaskName || "(No Name)";
      a.target = '_blank';
      nameCell.appendChild(a);
      row.appendChild(nameCell);

      tbody.appendChild(row);
    }

    if (tbody.innerHTML === '') {
      tbody.innerHTML = "<tr><td colspan='2'>No tasks found.</td></tr>";
    }

  } catch (error) {
    tbody.innerHTML = `<tr><td colspan='2'>Error loading tasks: ${error.message}</td></tr>`;
  }
}

window.onload = () => loadTasks(false);
