// tasks.js

(() => {
  const ENDPOINT = 'tasks.json';
  const INTERVAL_MS = 5000;        // poll every 5 seconds
  let lastDataHash = null;

  // Simple hash on JSON string to detect changes
  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return h;
  }

  async function loadTasks() {
    try {
      const resp = await fetch(ENDPOINT, { cache: 'no-store' });
      if (!resp.ok) throw new Error(resp.statusText);
      const jsonText = await resp.text();
      
      // only parse & render if changed
      const currentHash = hash(jsonText);
      if (currentHash === lastDataHash) return;
      lastDataHash = currentHash;

      const tasks = JSON.parse(jsonText);
      const tbody = document.getElementById('task-list');
      tbody.innerHTML = '';

      const active = tasks.filter(t => !t.IsNotWorking);
      if (active.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2">No active tasks.</td></tr>';
        return;
      }

      for (const t of active) {
        const tr = document.createElement('tr');
        const price = Number.isInteger(t.Price) ? t.Price : t.Price;
        tr.innerHTML = `
          <td>${price}</td>
          <td>
            <a href="${t.TaskLink||'#'}"
               target="_blank"
               rel="noopener noreferrer">
              ${t.TaskName||'(No Name)'}
            </a>
          </td>`;
        tbody.appendChild(tr);
      }
    } catch (err) {
      console.error('Error loading tasks.json:', err);
    }
  }

  // Load on start
  document.addEventListener('DOMContentLoaded', loadTasks);
  // Poll every 5s
  setInterval(loadTasks, INTERVAL_MS);
  // Also reload when tab regains focus
  window.addEventListener('focus', loadTasks);
})();
