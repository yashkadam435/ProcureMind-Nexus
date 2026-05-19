// =============================================
// ProcureMind Nexus — Treasury & Finance Page
// =============================================

registerPage('treasury', async (el) => {
  el.innerHTML = `
    <div class="fade-in">
      <!-- Budget Overview -->
      <div class="grid grid-4" style="margin-bottom:24px;" id="treasury-kpis">
        ${kpiSkeleton()}${kpiSkeleton()}${kpiSkeleton()}${kpiSkeleton()}
      </div>

      <!-- Budget Gauge + Portfolio -->
      <div class="grid grid-2" style="margin-bottom:24px;">
        <!-- Budget Gauge -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="gauge" style="width:18px;height:18px;color:var(--accent);"></i> Budget Utilization</div>
          </div>
          <div id="budget-gauge" style="text-align:center;padding:20px 0;"></div>
        </div>

        <!-- xStocks Portfolio -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="trending-up" style="width:18px;height:18px;color:var(--success);"></i> xStocks Portfolio</div>
            <span class="badge badge-purple">Paper Trading</span>
          </div>
          <div id="portfolio-content"></div>
        </div>
      </div>

      <!-- Spend Breakdown -->
      <div class="card" style="margin-bottom:24px;">
        <div class="card-header">
          <div class="card-title"><i data-lucide="pie-chart" style="width:18px;height:18px;color:var(--info);"></i> Spend Analytics</div>
        </div>
        <div id="spend-breakdown" class="grid grid-5" style="gap:12px;"></div>
      </div>

      <!-- Transaction History -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i data-lucide="list" style="width:18px;height:18px;color:var(--text-muted);"></i> Transaction History</div>
          <span class="badge badge-info" id="tx-count">0</span>
        </div>
        <div id="treasury-transactions"></div>
      </div>
    </div>`;
  lucide.createIcons();
  loadTreasuryData();
});

async function loadTreasuryData() {
  try {
    const [budget, portfolio, transactions] = await Promise.all([
      api.get('/treasury/budget'),
      api.get('/treasury/portfolio'),
      api.get('/transactions'),
    ]);

    // KPIs
    const remaining = budget.remaining || 0;
    const util = budget.utilization || 0;
    const totalPnl = portfolio.total_pnl || 0;
    const kpis = [
      { icon:'wallet', label:'Monthly Budget', value:`€${Number(budget.total_budget||0).toLocaleString('de-DE')}`, color:'#6366f1', sub:'Allocated' },
      { icon:'receipt', label:'Total Spent', value:`€${Number(budget.spent||0).toLocaleString('de-DE',{minimumFractionDigits:2})}`, color:'#ef4444', sub:`${util}% utilized` },
      { icon:'piggy-bank', label:'Remaining', value:`€${Number(remaining).toLocaleString('de-DE',{minimumFractionDigits:2})}`, color:'#10b981', sub:'Available' },
      { icon:'trending-up', label:'Portfolio P&L', value:`${totalPnl>=0?'+':''}€${Number(totalPnl).toLocaleString('de-DE',{minimumFractionDigits:2})}`, color: totalPnl>=0?'#10b981':'#ef4444', sub:`${(portfolio.total_pnl_pct||0).toFixed(2)}%` },
    ];
    document.getElementById('treasury-kpis').innerHTML = kpis.map(k => `
      <div class="stat-card slide-up">
        <div class="stat-icon" style="background:${k.color}22;color:${k.color};"><i data-lucide="${k.icon}" style="width:22px;height:22px;"></i></div>
        <div class="stat-value">${k.value}</div>
        <div class="stat-label">${k.label}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">${k.sub}</div>
      </div>`).join('');

    // Budget Gauge
    const gaugeEl = document.getElementById('budget-gauge');
    gaugeEl.innerHTML = `
      <div style="position:relative;width:200px;height:110px;margin:0 auto;">
        <svg viewBox="0 0 200 110" style="width:200px;height:110px;">
          <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="14" stroke-linecap="round"/>
          <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="url(#budgetGrad)" stroke-width="14" stroke-linecap="round"
                stroke-dasharray="267" stroke-dashoffset="${267 - (267 * Math.min(util,100) / 100)}" style="transition:stroke-dashoffset 2s ease;"/>
          <defs><linearGradient id="budgetGrad"><stop offset="0%" stop-color="#10b981"/><stop offset="60%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#ef4444"/></linearGradient></defs>
        </svg>
        <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);text-align:center;">
          <div style="font-size:32px;font-weight:900;">${util}%</div>
          <div style="font-size:11px;color:var(--text-muted);">Budget Used</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:12px;font-size:12px;color:var(--text-muted);">
        <span>€0</span>
        <span>€${Number(budget.total_budget||0).toLocaleString('de-DE')}</span>
      </div>`;

    // Portfolio
    const investments = portfolio.investments || [];
    const portfolioEl = document.getElementById('portfolio-content');
    if (investments.length > 0) {
      portfolioEl.innerHTML = `
        <div style="margin-bottom:16px;">
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">Total Portfolio Value</div>
          <div style="font-size:24px;font-weight:800;">€${Number(portfolio.total_portfolio_value||0).toLocaleString('de-DE',{minimumFractionDigits:2})}</div>
        </div>
        ${investments.map(inv => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border);">
            <div>
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="background:rgba(139,92,246,0.15);color:#a78bfa;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:700;">${inv.symbol}</span>
                <span style="font-size:13px;font-weight:600;">${inv.name}</span>
              </div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">${inv.shares} shares @ €${inv.avg_price}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:14px;font-weight:700;">€${inv.current_price}</div>
              <div style="font-size:12px;font-weight:600;color:${inv.pnl_pct>=0?'var(--success)':'var(--danger)'};">
                ${inv.pnl_pct>=0?'+':''}${inv.pnl_pct}% (€${inv.pnl_amount>=0?'+':''}${inv.pnl_amount})
              </div>
            </div>
          </div>`).join('')}
        <div style="margin-top:16px;">
          <div style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px;">
            <i data-lucide="info" style="width:14px;height:14px;"></i>
            Paper trading via Kraken xStocks — no real funds
          </div>
        </div>`;
    } else {
      portfolioEl.innerHTML = '<div class="empty-state"><i data-lucide="bar-chart-3"></i><h3>No Positions</h3><p>Treasury auto-invest is enabled in settings</p></div>';
    }

    // Spend Breakdown (simulated categories)
    const categories = [
      { name:'CNC Parts', pct:35, color:'#6366f1', amount: (budget.spent||0)*0.35 },
      { name:'Raw Materials', pct:25, color:'#3b82f6', amount: (budget.spent||0)*0.25 },
      { name:'IT Services', pct:20, color:'#8b5cf6', amount: (budget.spent||0)*0.20 },
      { name:'Logistics', pct:12, color:'#10b981', amount: (budget.spent||0)*0.12 },
      { name:'Other', pct:8, color:'#f59e0b', amount: (budget.spent||0)*0.08 },
    ];
    document.getElementById('spend-breakdown').innerHTML = categories.map(c => `
      <div style="text-align:center;">
        <div style="position:relative;width:80px;height:80px;margin:0 auto 10px;">
          <svg viewBox="0 0 36 36" style="width:80px;height:80px;transform:rotate(-90deg);">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="3"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="${c.color}" stroke-width="3" stroke-linecap="round"
                    stroke-dasharray="${c.pct} ${100-c.pct}" style="transition:stroke-dasharray 1.5s ease;"/>
          </svg>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;">${c.pct}%</div>
        </div>
        <div style="font-size:12px;font-weight:600;">${c.name}</div>
        <div style="font-size:11px;color:var(--text-muted);">€${Number(c.amount).toLocaleString('de-DE',{minimumFractionDigits:0})}</div>
      </div>`).join('');

    // Transactions
    const txs = transactions.transactions || [];
    document.getElementById('tx-count').textContent = txs.length;
    if (txs.length > 0) {
      document.getElementById('treasury-transactions').innerHTML = `
        <div class="table-container"><table>
          <thead><tr><th>Date</th><th>Amount</th><th>Currency</th><th>Recipient</th><th>Type</th><th>Purpose</th><th>Status</th></tr></thead>
          <tbody>${txs.map(t => `<tr>
            <td style="font-size:11px;color:var(--text-muted);">${t.created_at||''}</td>
            <td style="font-weight:700;">€${Number(t.amount||0).toLocaleString('de-DE',{minimumFractionDigits:2})}</td>
            <td>${t.currency||'EUR'}</td>
            <td>${t.recipient||'—'}</td>
            <td><span class="badge badge-info">${t.tx_type||'payment'}</span></td>
            <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.purpose||'—'}</td>
            <td><span class="badge badge-${t.status==='confirmed'?'success':t.status==='pending'?'warning':'danger'}">${t.status}</span></td>
          </tr>`).join('')}</tbody>
        </table></div>`;
    } else {
      document.getElementById('treasury-transactions').innerHTML = '<div class="empty-state"><i data-lucide="inbox"></i><h3>No Transactions</h3><p>Transactions will appear after procurement execution</p></div>';
    }

    lucide.createIcons();
  } catch(err) {
    console.error('Treasury load error:', err);
    showToast('Failed to load treasury data', 'error');
  }
}
