// =============================================
// ProcureMind Nexus — Main Application
// =============================================

// === Notifications System ===
let notifications = [];

function addNotification(type, title, message) {
  const icons = { agent:'cpu', approval:'shield-check', system:'info', payment:'wallet' };
  const colors = { agent:'#6366f1', approval:'#f59e0b', system:'#3b82f6', payment:'#10b981' };
  notifications.unshift({
    id: Date.now(), type, title, message,
    icon: icons[type]||'info', color: colors[type]||'#6366f1',
    time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})
  });
  if (notifications.length > 20) notifications.pop();
  renderNotifications();
}

function renderNotifications() {
  const list = document.getElementById('notif-list');
  const badge = document.getElementById('notif-count');
  if (!list) return;
  if (notifications.length === 0) {
    list.innerHTML = '<div class="notif-empty">No notifications yet</div>';
    if (badge) { badge.style.display = 'none'; }
    return;
  }
  if (badge) { badge.textContent = notifications.length; badge.style.display = 'flex'; }
  list.innerHTML = notifications.map(n => `
    <div class="notif-item">
      <div class="notif-icon" style="background:${n.color}18;color:${n.color};"><i data-lucide="${n.icon}" style="width:16px;height:16px;"></i></div>
      <div style="flex:1;">
        <div style="font-size:12px;font-weight:600;color:var(--text-primary);">${n.title}</div>
        <div class="notif-text">${n.message}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>`).join('');
  if (window.lucide) lucide.createIcons();
}

function toggleNotifications() {
  const dd = document.getElementById('notif-dropdown');
  dd.classList.toggle('open');
  if (dd.classList.contains('open')) renderNotifications();
}

function clearNotifications() {
  notifications = [];
  renderNotifications();
  toggleNotifications();
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  const btn = document.getElementById('notif-btn');
  const dd = document.getElementById('notif-dropdown');
  if (btn && dd && !btn.contains(e.target)) dd.classList.remove('open');
});

// === Keyboard Shortcuts ===
function toggleShortcuts() {
  document.getElementById('shortcuts-overlay').classList.toggle('open');
}

// === Global Search ===
function initSearch() {
  const input = document.getElementById('global-search');
  if (!input) return;
  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Escape') { input.blur(); input.value = ''; return; }
    if (e.key !== 'Enter') return;
    const q = input.value.trim();
    if (!q) return;
    try {
      const results = await api.get('/suppliers/search?q=' + encodeURIComponent(q));
      if (results.suppliers && results.suppliers.length > 0) {
        showToast(`Found ${results.suppliers.length} supplier(s) matching "${q}"`, 'success');
        navigateTo('settings');
        setTimeout(() => switchSettingsTab && switchSettingsTab('suppliers'), 200);
      } else {
        showToast(`No results for "${q}"`, 'info');
      }
    } catch(err) { showToast('Search failed', 'error'); }
    input.value = '';
    input.blur();
  });
}

// === Animated Counter ===
function animateCounter(el, target, prefix='', suffix='', duration=800) {
  if (!el) return;
  const start = 0;
  const startTime = performance.now();
  const isFloat = String(target).includes('.');
  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;
    el.textContent = prefix + (isFloat ? current.toFixed(2) : Math.floor(current).toLocaleString('de-DE')) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  el.classList.add('counter-animate');
  requestAnimationFrame(step);
}

// === Init ===
(function init() {
  checkAPIHealth();
  initSearch();

  // Connect SSE for real-time updates
  connectSSE((agents) => {
    if (currentPage === 'dashboard') {
      agents.forEach(a => {
        const dots = document.querySelectorAll(`.agent-status.${a.name}`);
      });
    }
    // Generate notifications from agent activity
    agents.forEach(a => {
      if (a.status === 'active' && a.current_task) {
        const existing = notifications.find(n => n.title === a.name && n.message === a.current_task);
        if (!existing) addNotification('agent', a.name, a.current_task);
      }
    });
  });

  if (window.lucide) lucide.createIcons();
  const hash = window.location.hash.slice(1) || 'dashboard';
  navigateTo(hash);

  // Seed initial system notification
  addNotification('system', 'System Ready', 'ProcureMind Nexus initialized');
})();

// Override navigateTo to also update topbar
const _origNavigate = navigateTo;
navigateTo = function(page) {
  const meta = PAGE_META?.[page] || { title: page, sub: '', icon: 'circle' };
  const titleEl = document.getElementById('page-title');
  const subEl = document.getElementById('page-subtitle');
  if (titleEl) titleEl.textContent = meta.title;
  if (subEl) subEl.textContent = meta.sub;
  document.getElementById('sidebar')?.classList.remove('open');
  const content = document.getElementById('page-content');
  if (content) {
    content.classList.remove('page-transition');
    void content.offsetWidth;
    content.classList.add('page-transition');
  }
  _origNavigate(page);
  setTimeout(() => { if (window.lucide) lucide.createIcons(); }, 100);
};

async function checkAPIHealth() {
  const statusEl = document.getElementById('api-status');
  const dotEl = document.getElementById('conn-dot');
  try {
    const data = await api.get('/health');
    if (data.gemini_connected) {
      statusEl.textContent = '● AI Engine Online';
      statusEl.style.color = 'var(--success)';
      if (dotEl) dotEl.className = 'connection-dot online';
    } else {
      statusEl.textContent = '● API Only';
      statusEl.style.color = 'var(--warning)';
    }
  } catch(e) {
    statusEl.textContent = '● Offline';
    statusEl.style.color = 'var(--danger)';
    if (dotEl) dotEl.className = 'connection-dot offline';
  }
}

setInterval(checkAPIHealth, 30000);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
    if (e.key === 'Escape') e.target.blur();
    return;
  }
  // ? → show shortcuts
  if (e.key === '?' || (e.shiftKey && e.key === '/')) { toggleShortcuts(); return; }
  // Esc → close overlays
  if (e.key === 'Escape') {
    document.getElementById('shortcuts-overlay')?.classList.remove('open');
    document.getElementById('notif-dropdown')?.classList.remove('open');
    return;
  }
  // / → focus search
  if (e.key === '/') { e.preventDefault(); document.getElementById('global-search')?.focus(); return; }
  // 1-5 → navigate
  const pages = ['dashboard','procure','contracts','treasury','settings'];
  const num = parseInt(e.key);
  if (num >= 1 && num <= 5) navigateTo(pages[num-1]);
});
