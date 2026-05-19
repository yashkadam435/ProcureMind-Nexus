// =============================================
// ProcureMind Nexus — Command Center (Dashboard)
// =============================================

const PAGE_META = {
  dashboard:  { title: 'Command Center',    sub: 'Real-time procurement intelligence overview', icon: 'layout-dashboard' },
  procure:    { title: 'Procurement',        sub: 'AI-powered sourcing and supplier discovery',  icon: 'shopping-cart' },
  contracts:  { title: 'Contract Analysis',  sub: 'AI-powered document intelligence',            icon: 'file-search' },
  treasury:   { title: 'Treasury & Finance', sub: 'Budget management and portfolio tracking',    icon: 'landmark' },
  settings:   { title: 'Settings & Governance', sub: 'Policy configuration and compliance',      icon: 'settings' },
};

registerPage('dashboard', async (el) => {
  el.innerHTML = `
    <div class="fade-in">
      <!-- KPI Row -->
      <div class="grid grid-4" id="kpi-row" style="margin-bottom:24px;">
        ${kpiSkeleton()}${kpiSkeleton()}${kpiSkeleton()}${kpiSkeleton()}
      </div>

      <!-- Agent Status -->
      <div class="card" style="margin-bottom:24px;">
        <div class="card-header">
          <div class="card-title"><i data-lucide="cpu" style="width:18px;height:18px;color:var(--accent);"></i> Agent Network</div>
          <span class="badge badge-info" id="agent-count">5 Agents</span>
        </div>
        <div class="grid grid-5" id="agents-grid">
          ${agentSkeleton()}${agentSkeleton()}${agentSkeleton()}${agentSkeleton()}${agentSkeleton()}
        </div>
      </div>

      <!-- Two Columns: Approvals + Transactions -->
      <div class="grid grid-2">
        <!-- Pending Approvals -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="shield-check" style="width:18px;height:18px;color:var(--warning);"></i> Pending Approvals</div>
            <span class="badge badge-warning" id="approval-count">0</span>
          </div>
          <div id="approvals-list">
            <div class="empty-state"><i data-lucide="check-circle-2"></i><h3>All Clear</h3><p>No pending approvals</p></div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="receipt" style="width:18px;height:18px;color:var(--success);"></i> Recent Transactions</div>
          </div>
          <div id="transactions-list">
            <div class="empty-state"><i data-lucide="inbox"></i><h3>No Transactions</h3><p>Execute a procurement to see payments</p></div>
          </div>
        </div>
      </div>

      <!-- Workflows -->
      <div class="card" style="margin-top:24px;">
        <div class="card-header">
          <div class="card-title"><i data-lucide="git-branch" style="width:18px;height:18px;color:var(--info);"></i> Recent Workflows</div>
          <button class="btn btn-sm btn-secondary" onclick="navigateTo('procure')"><i data-lucide="plus" style="width:14px;height:14px;"></i> New</button>
        </div>
        <div id="workflows-list">
          <div class="empty-state"><i data-lucide="rocket"></i><h3>No Workflows Yet</h3><p>Start your first procurement from the Procurement page</p></div>
        </div>
      </div>
    </div>`;
  lucide.createIcons();
  loadDashboardData();
});

async function loadDashboardData() {
  try {
    const [dash, agents, approvals, workflows] = await Promise.all([
      api.get('/analytics/dashboard'),
      api.get('/agents/status'),
      api.get('/approvals'),
      api.get('/workflows'),
    ]);

    // Guard: stop if user navigated away from dashboard
    const kpiRow = document.getElementById('kpi-row');
    if (!kpiRow) return;

    // KPIs
    const kpis = [
      { icon: 'git-branch', label: 'Total Workflows', value: dash.total_workflows, change: `${dash.completed_workflows} completed`, up: true, color: '#6366f1' },
      { icon: 'factory', label: 'Active Suppliers', value: dash.supplier_count, change: 'In database', up: true, color: '#3b82f6' },
      { icon: 'euro', label: 'Total Spend', value: `€${Number(dash.total_spent||0).toLocaleString('de-DE',{minimumFractionDigits:2})}`, change: `${dash.budget?.utilization||0}% of budget`, up: false, color: '#10b981' },
      { icon: 'shield-check', label: 'Pending Approvals', value: dash.pending_approvals, change: `${dash.contract_count} contracts`, up: dash.pending_approvals > 0, color: '#f59e0b' },
    ];
    kpiRow.innerHTML = kpis.map(k => `
      <div class="stat-card slide-up">
        <div class="stat-icon" style="background:${k.color}22;color:${k.color};">
          <i data-lucide="${k.icon}" style="width:22px;height:22px;"></i>
        </div>
      <div class="stat-value counter-value" data-target="${typeof k.value==='number'?k.value:''}">${k.value}</div>
        <div class="stat-label">${k.label}</div>
        <div class="stat-change ${k.up?'up':''}"><i data-lucide="${k.up?'trending-up':'activity'}" style="width:12px;height:12px;"></i> ${k.change}</div>
      </div>`).join('');

    // Agents
    const agentIcons = { scout:'search', analyst:'scan-search', negotiator:'handshake', compliance:'shield-alert', payment:'wallet' };
    const agentColors = { scout:'#3b82f6', analyst:'#8b5cf6', negotiator:'#f59e0b', compliance:'#10b981', payment:'#6366f1' };
    const agentModels = { scout:'AI Flash', analyst:'Neural Core', negotiator:'Neural Core', compliance:'Neural Core', payment:'AI Flash' };
    const agentsGrid = document.getElementById('agents-grid');
    if (agentsGrid) agentsGrid.innerHTML = (agents.agents || []).map(a => `
      <div class="agent-card">
        <div class="agent-header">
          <div class="agent-icon" style="background:${agentColors[a.name]||'#6366f1'}22;color:${agentColors[a.name]||'#6366f1'};">
            <i data-lucide="${agentIcons[a.name]||'bot'}" style="width:22px;height:22px;"></i>
          </div>
          <div>
            <div class="agent-name">${a.display_name || a.name}</div>
            <div class="agent-role">${agentModels[a.name] || 'Intelligence Layer'}</div>
          </div>
        </div>
        <div class="agent-status ${a.status}"><span class="dot"></span>${a.status.charAt(0).toUpperCase()+a.status.slice(1)}</div>
        ${a.current_task ? `<div style="font-size:11px;color:var(--text-muted);margin-top:8px;">${a.current_task}</div>` : ''}
      </div>`).join('');

    // Approvals
    const pending = (approvals.approvals || []).filter(a => a.status === 'pending');
    updatePendingBadge(pending.length);
    const approvalCount = document.getElementById('approval-count');
    if (approvalCount) approvalCount.textContent = pending.length;
    const approvalsList = document.getElementById('approvals-list');
    if (approvalsList && pending.length > 0) {
      approvalsList.innerHTML = pending.map(a => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border);">
          <div>
            <div style="font-size:13px;font-weight:600;">€${Number(a.amount||0).toLocaleString('de-DE',{minimumFractionDigits:2})}</div>
            <div style="font-size:11px;color:var(--text-muted);">${a.category || 'general'} — ${a.reason || 'Requires review'}</div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-sm btn-success" onclick="approveItem('${a.id}','approved')"><i data-lucide="check" style="width:14px;height:14px;"></i> Approve</button>
            <button class="btn btn-sm btn-danger" onclick="approveItem('${a.id}','denied')"><i data-lucide="x" style="width:14px;height:14px;"></i> Deny</button>
          </div>
        </div>`).join('');
    }

    // Transactions
    const txs = dash.recent_transactions || [];
    const txList = document.getElementById('transactions-list');
    if (txList && txs.length > 0) {
      txList.innerHTML = `
        <div class="table-container"><table>
          <thead><tr><th>Amount</th><th>Recipient</th><th>Purpose</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>${txs.map(t => `<tr>
            <td style="font-weight:700;">€${Number(t.amount||0).toLocaleString('de-DE',{minimumFractionDigits:2})}</td>
            <td>${t.recipient||'—'}</td>
            <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.purpose||'—'}</td>
            <td><span class="badge badge-${t.status==='confirmed'?'success':t.status==='pending'?'warning':'danger'}">${t.status}</span></td>
            <td style="font-size:11px;color:var(--text-muted);">${t.created_at||''}</td>
          </tr>`).join('')}</tbody>
        </table></div>`;
    }

    // Workflows
    const wfs = workflows.workflows || [];
    const wfList = document.getElementById('workflows-list');
    if (wfList && wfs.length > 0) {
      wfList.innerHTML = `
        <div class="table-container"><table>
          <thead><tr><th>Request</th><th>Status</th><th>Budget</th><th>Spent</th><th>Created</th></tr></thead>
          <tbody>${wfs.slice(0,8).map(w => `<tr>
            <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${w.request_text}</td>
            <td><span class="badge badge-${w.status==='completed'?'success':w.status==='running'?'info':w.status==='paused'?'warning':'danger'}">${w.status}</span></td>
            <td>€${Number(w.total_budget||0).toLocaleString('de-DE')}</td>
            <td>€${Number(w.spent||0).toLocaleString('de-DE')}</td>
            <td style="font-size:11px;color:var(--text-muted);">${w.created_at||''}</td>
          </tr>`).join('')}</tbody>
        </table></div>`;
    }

    lucide.createIcons();
  } catch (err) {
    console.error('Dashboard load error:', err);
  }
}

async function approveItem(id, decision) {
  try {
    await api.post(`/approvals/${id}`, { status: decision, decided_by: 'admin' });
    showToast(`Approval ${decision}`, decision==='approved'?'success':'info');
    loadDashboardData();
  } catch(e) { showToast('Approval failed: '+e.message, 'error'); }
}

function updatePendingBadge(count) {
  const badge = document.getElementById('pending-badge');
  if (badge) { badge.textContent = count; badge.style.display = count > 0 ? 'inline' : 'none'; }
}

function kpiSkeleton() {
  return `<div class="stat-card"><div class="skeleton" style="width:40px;height:40px;border-radius:12px;margin-bottom:14px;"></div><div class="skeleton" style="width:60%;height:28px;margin-bottom:6px;"></div><div class="skeleton" style="width:80%;height:14px;"></div></div>`;
}
function agentSkeleton() {
  return `<div class="agent-card"><div style="display:flex;gap:12px;align-items:center;margin-bottom:14px;"><div class="skeleton" style="width:44px;height:44px;border-radius:12px;"></div><div><div class="skeleton" style="width:80px;height:14px;margin-bottom:6px;"></div><div class="skeleton" style="width:60px;height:10px;"></div></div></div><div class="skeleton" style="width:70px;height:24px;border-radius:20px;"></div></div>`;
}
