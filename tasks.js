// tasks.js

(() => {
  const ENDPOINT = 'tasks.json';
  const INTERVAL_MS = 3000;          // poll every 3 seconds
  let etag = null;                   // store last ETag

  const updatedDiv = document.getElementById('updated');
  const tbody      = document.getElementById('task-list');

  async function loadTasks() {
    try {
      const headers = etag ? { 'If-None-Match': etag } : {};
      const resp = await fetch(ENDPOINT, { cache: 'no-store', headers });

      if (resp.status === 304) {
        // not modified → no need to re-render
        return;
      }
      if (!resp.ok) throw new Error(resp.statusText);

      etag = resp.headers.get('ETag');

      const tasks = await resp.json();
      render(tasks.filter(t => !t.IsNotWorking));

      updatedDiv.textContent = 
        'Last updated: ' + new Date().toLocaleTimeString();
    } catch (err) {
      console.error('Fetch error:', err);
      // Optionally show an error row
      tbody.innerHTML = 
        `<tr><td colspan="2">Error loading tasks</td></tr>`;
    }
  }

  function render(activeTasks) {
    if (activeTasks.length === 0) {
      tbody.innerHTML = `<tr><td colspan="2">No active tasks.</td></tr>`;
      return;
    }

    let html = '';
    for (const t of activeTasks) {
      const price = Number.isInteger(t.Price) ? t.Price : t.Price;
      const link  = t.TaskLink?.trim() || '#';
      const name  = t.TaskName?.trim() || '(No Name)';
      html += 
        `<tr>
           <td>${price}</td>
           <td>
             <a href="${link}" target="_blank" rel="noopener noreferrer">
               ${name}
             </a>
           </td>
         </tr>`;
    }
    tbody.innerHTML = html;
  }

  // initial load
  document.addEventListener('DOMContentLoaded', loadTasks);
  // poll interval
  setInterval(loadTasks, INTERVAL_MS);
  // refresh on focus
  window.addEventListener('focus', loadTasks);
})();
