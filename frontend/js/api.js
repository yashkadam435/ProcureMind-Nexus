// ProcureMind Nexus - API Client
const API_BASE = window.location.origin + '/api';

const api = {
  async get(path) {
    const res = await fetch(API_BASE + path);
    if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
    return res.json();
  },
  async post(path, data) {
    const res = await fetch(API_BASE + path, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
    return res.json();
  },
  async upload(path, file) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(API_BASE + path, { method: 'POST', body: fd });
    if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
    return res.json();
  },
};

// SSE for real-time agent updates
let eventSource = null;
function connectSSE(onMessage) {
  if (eventSource) eventSource.close();
  eventSource = new EventSource(API_BASE + '/stream');
  eventSource.onmessage = (e) => { try { onMessage(JSON.parse(e.data)); } catch(err) {} };
  eventSource.onerror = () => { setTimeout(() => connectSSE(onMessage), 5000); };
}

// Toast notifications
function showToast(msg, type = 'info') {
  let c = document.getElementById('toast-container');
  if (!c) { c = document.createElement('div'); c.id = 'toast-container'; c.className = 'toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icons = { success: 'check-circle', error: 'alert-circle', info: 'info' };
  t.innerHTML = `<i data-lucide="${icons[type] || 'info'}"></i><span>${msg}</span>`;
  c.appendChild(t);
  if (window.lucide) lucide.createIcons();
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(50px)'; setTimeout(() => t.remove(), 300); }, 4000);
}
