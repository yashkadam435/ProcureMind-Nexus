// =============================================
// ProcureMind Nexus — Contract Analysis Page
// =============================================

registerPage('contracts', async (el) => {
  el.innerHTML = `
    <div class="fade-in">
      <!-- Upload Card -->
      <div class="card" style="margin-bottom:24px;">
        <div class="card-header">
          <div class="card-title"><i data-lucide="upload" style="width:18px;height:18px;color:var(--accent);"></i> Analyze Contract</div>
        </div>
        <div class="upload-area" id="upload-area" onclick="document.getElementById('file-input').click()">
          <div class="upload-icon"><i data-lucide="file-up" style="width:48px;height:48px;"></i></div>
          <div style="font-size:15px;font-weight:600;margin-bottom:4px;">Drop contract PDF here</div>
          <div style="font-size:12px;color:var(--text-muted);">or click to browse — Supports PDF, DOC, images</div>
          <input type="file" id="file-input" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" style="display:none;" onchange="handleContractUpload(this.files[0])">
        </div>
        <div id="upload-progress" style="display:none;margin-top:16px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <div class="loading-spinner" style="width:20px;height:20px;margin:0;border-width:2px;"></div>
            <span style="font-size:13px;font-weight:600;" id="upload-status">Uploading and analyzing with AI Engine…</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" id="upload-fill" style="width:30%;background:var(--gradient-1);"></div></div>
        </div>
      </div>

      <!-- Analysis Results (hidden until analysis complete) -->
      <div id="analysis-results" style="display:none;">
        <!-- Risk Score & Summary -->
        <div class="grid grid-2" style="margin-bottom:24px;">
          <div class="card" style="text-align:center;">
            <div class="card-title" style="justify-content:center;margin-bottom:20px;">
              <i data-lucide="gauge" style="width:18px;height:18px;color:var(--warning);"></i> Risk Assessment
            </div>
            <div id="risk-gauge-container">
              <div style="position:relative;width:180px;height:100px;margin:0 auto;">
                <svg viewBox="0 0 180 100" style="width:180px;height:100px;">
                  <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="12" stroke-linecap="round"/>
                  <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="url(#riskGrad)" stroke-width="12" stroke-linecap="round" id="risk-arc"
                        stroke-dasharray="251" stroke-dashoffset="251" style="transition:stroke-dashoffset 1.5s ease;"/>
                  <defs><linearGradient id="riskGrad"><stop offset="0%" stop-color="#10b981"/><stop offset="50%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#ef4444"/></linearGradient></defs>
                </svg>
                <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);text-align:center;">
                  <div style="font-size:36px;font-weight:900;" id="risk-score-num">—</div>
                  <div style="font-size:11px;color:var(--text-muted);">/ 100</div>
                </div>
              </div>
            </div>
            <div id="risk-label" class="badge" style="margin-top:16px;font-size:13px;padding:6px 16px;">—</div>
          </div>

          <div class="card">
            <div class="card-title" style="margin-bottom:12px;">
              <i data-lucide="file-text" style="width:18px;height:18px;color:var(--info);"></i> Executive Summary
            </div>
            <div id="contract-summary" style="font-size:13px;line-height:1.8;color:var(--text-secondary);">—</div>
            <div style="margin-top:16px;" id="contract-parties"></div>
          </div>
        </div>

        <!-- Risk Factors -->
        <div class="card" style="margin-bottom:24px;">
          <div class="card-header">
            <div class="card-title"><i data-lucide="alert-triangle" style="width:18px;height:18px;color:var(--danger);"></i> Risk Factors</div>
          </div>
          <div id="risk-factors-list"></div>
        </div>

        <!-- Key Clauses -->
        <div class="card" style="margin-bottom:24px;">
          <div class="card-header">
            <div class="card-title"><i data-lucide="book-open" style="width:18px;height:18px;color:var(--accent);"></i> Key Clauses</div>
          </div>
          <div id="clauses-list"></div>
        </div>

        <!-- Terms Grid -->
        <div class="grid grid-3" style="margin-bottom:24px;">
          <div class="card" id="payment-terms-card">
            <div class="card-title" style="margin-bottom:12px;"><i data-lucide="credit-card" style="width:16px;height:16px;color:var(--success);"></i> Payment Terms</div>
            <div id="payment-terms-content">—</div>
          </div>
          <div class="card" id="delivery-terms-card">
            <div class="card-title" style="margin-bottom:12px;"><i data-lucide="truck" style="width:16px;height:16px;color:var(--info);"></i> Delivery Terms</div>
            <div id="delivery-terms-content">—</div>
          </div>
          <div class="card" id="termination-card">
            <div class="card-title" style="margin-bottom:12px;"><i data-lucide="x-circle" style="width:16px;height:16px;color:var(--danger);"></i> Termination</div>
            <div id="termination-content">—</div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="card" style="margin-bottom:24px;">
          <div class="card-header">
            <div class="card-title"><i data-lucide="lightbulb" style="width:18px;height:18px;color:var(--warning);"></i> AI Recommendations</div>
          </div>
          <div id="recommendations-list"></div>
        </div>
      </div>

      <!-- Contract History -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i data-lucide="archive" style="width:18px;height:18px;color:var(--text-muted);"></i> Contract History</div>
        </div>
        <div id="contract-history"></div>
      </div>
    </div>`;

  // Drag and drop
  const area = document.getElementById('upload-area');
  area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('dragover'); });
  area.addEventListener('dragleave', () => area.classList.remove('dragover'));
  area.addEventListener('drop', (e) => {
    e.preventDefault(); area.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleContractUpload(e.dataTransfer.files[0]);
  });

  lucide.createIcons();
  loadContractHistory();
});

async function handleContractUpload(file) {
  if (!file) return;
  const prog = document.getElementById('upload-progress');
  const fill = document.getElementById('upload-fill');
  const status = document.getElementById('upload-status');

  prog.style.display = 'block';
  status.textContent = `Analyzing "${file.name}" with AI Engine…`;
  fill.style.width = '30%';

  // Animate progress
  let pct = 30;
  const iv = setInterval(() => { pct = Math.min(pct + 5, 85); fill.style.width = pct+'%'; }, 800);

  try {
    const result = await api.upload('/contracts/analyze', file);
    clearInterval(iv);
    fill.style.width = '100%';
    status.textContent = '✅ Analysis Complete';

    setTimeout(() => { prog.style.display = 'none'; }, 1500);

    // Display results
    displayAnalysis(result);
    showToast('Contract analyzed successfully', 'success');
    loadContractHistory();
  } catch(err) {
    clearInterval(iv);
    fill.style.width = '0%';
    status.textContent = '❌ Analysis failed: ' + err.message;
    showToast('Contract analysis failed', 'error');
  }
}

function displayAnalysis(result) {
  const a = result.analysis || {};
  document.getElementById('analysis-results').style.display = 'block';

  // Risk Score
  const score = a.overall_risk_score || 0;
  document.getElementById('risk-score-num').textContent = score;
  const arc = document.getElementById('risk-arc');
  const dashOffset = 251 - (251 * score / 100);
  arc.style.strokeDashoffset = dashOffset;

  const label = document.getElementById('risk-label');
  if (score <= 30) { label.textContent = '✅ Low Risk'; label.className = 'badge badge-success'; }
  else if (score <= 70) { label.textContent = '⚠️ Medium Risk'; label.className = 'badge badge-warning'; }
  else { label.textContent = '🔴 High Risk'; label.className = 'badge badge-danger'; }

  // Summary
  document.getElementById('contract-summary').textContent = a.summary || 'No summary available';

  // Parties
  if (a.parties) {
    document.getElementById('contract-parties').innerHTML = `
      <div style="display:flex;gap:12px;">
        <div style="flex:1;background:var(--bg-glass);border-radius:var(--radius-xs);padding:10px;">
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Buyer</div>
          <div style="font-size:13px;font-weight:600;margin-top:4px;">${a.parties.buyer||'—'}</div>
        </div>
        <div style="flex:1;background:var(--bg-glass);border-radius:var(--radius-xs);padding:10px;">
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Supplier</div>
          <div style="font-size:13px;font-weight:600;margin-top:4px;">${a.parties.supplier||'—'}</div>
        </div>
      </div>`;
  }

  // Risk Factors
  const risks = a.risk_factors || [];
  document.getElementById('risk-factors-list').innerHTML = risks.length ? risks.map(r => `
    <div style="display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);">
      <span class="badge badge-${r.severity==='high'?'danger':r.severity==='medium'?'warning':'success'}" style="min-width:70px;justify-content:center;">${r.severity}</span>
      <div>
        <div style="font-size:13px;color:var(--text-primary);">${r.description}</div>
        ${r.clause_ref ? `<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">Ref: ${r.clause_ref}</div>` : ''}
      </div>
    </div>`).join('') : '<div style="font-size:13px;color:var(--text-muted);padding:12px 0;">No risk factors identified</div>';

  // Key Clauses
  const clauses = a.key_clauses || [];
  document.getElementById('clauses-list').innerHTML = clauses.length ? clauses.map(c => `
    <div class="accordion-item">
      <div class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
        <span style="display:flex;align-items:center;gap:8px;">
          <i data-lucide="file-text" style="width:14px;height:14px;color:var(--accent);"></i>
          ${c.title||'Clause'}
          ${c.page ? `<span style="font-size:10px;color:var(--text-muted);">p.${c.page}</span>` : ''}
        </span>
        <i data-lucide="chevron-down" style="width:14px;height:14px;"></i>
      </div>
      <div class="accordion-body"><p style="font-size:13px;color:var(--text-secondary);line-height:1.7;">${c.summary||''}</p></div>
    </div>`).join('') : '<div style="font-size:13px;color:var(--text-muted);padding:12px 0;">No key clauses extracted</div>';

  // Payment Terms
  if (a.payment_terms) {
    const pt = a.payment_terms;
    document.getElementById('payment-terms-content').innerHTML = `
      <div style="font-size:13px;line-height:1.8;color:var(--text-secondary);">
        ${pt.method ? `<div><strong>Method:</strong> ${pt.method}</div>` : ''}
        ${pt.days ? `<div><strong>Net:</strong> ${pt.days} days</div>` : ''}
        ${pt.currency ? `<div><strong>Currency:</strong> ${pt.currency}</div>` : ''}
        ${pt.details ? `<div style="margin-top:6px;">${pt.details}</div>` : ''}
      </div>`;
  }

  // Delivery Terms
  if (a.delivery_terms) {
    const dt = a.delivery_terms;
    document.getElementById('delivery-terms-content').innerHTML = `
      <div style="font-size:13px;line-height:1.8;color:var(--text-secondary);">
        ${dt.incoterm ? `<div><strong>Incoterm:</strong> ${dt.incoterm}</div>` : ''}
        ${dt.lead_time_days ? `<div><strong>Lead Time:</strong> ${dt.lead_time_days} days</div>` : ''}
        ${dt.penalties ? `<div style="margin-top:6px;color:var(--warning);"><strong>Penalties:</strong> ${dt.penalties}</div>` : ''}
      </div>`;
  }

  // Termination
  if (a.termination) {
    const tm = a.termination;
    document.getElementById('termination-content').innerHTML = `
      <div style="font-size:13px;line-height:1.8;color:var(--text-secondary);">
        ${tm.notice_days ? `<div><strong>Notice:</strong> ${tm.notice_days} days</div>` : ''}
        ${(tm.conditions||[]).length ? `<ul style="padding-left:16px;margin-top:6px;">${tm.conditions.map(c=>`<li>${c}</li>`).join('')}</ul>` : ''}
      </div>`;
  }

  // Recommendations
  const recs = a.recommendations || [];
  document.getElementById('recommendations-list').innerHTML = recs.length ? `
    <ul style="padding-left:0;list-style:none;">
      ${recs.map((r,i) => `<li style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);font-size:13px;color:var(--text-secondary);">
        <span style="background:var(--gradient-1);color:white;font-size:10px;font-weight:700;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${i+1}</span>
        ${r}
      </li>`).join('')}
    </ul>` : '<div style="font-size:13px;color:var(--text-muted);">No recommendations</div>';

  lucide.createIcons();

  // Scroll to results
  document.getElementById('analysis-results').scrollIntoView({ behavior:'smooth', block:'start' });
}

async function loadContractHistory() {
  try {
    const data = await api.get('/contracts');
    const contracts = data.contracts || [];
    const el = document.getElementById('contract-history');
    if (!el) return;
    if (contracts.length === 0) {
      el.innerHTML = '<div class="empty-state"><i data-lucide="file-x"></i><h3>No Contracts</h3><p>Upload a contract PDF to analyze</p></div>';
    } else {
      el.innerHTML = `<div class="table-container"><table>
        <thead><tr><th>Filename</th><th>Risk Score</th><th>Size</th><th>Status</th><th>Analyzed</th></tr></thead>
        <tbody>${contracts.map(c => `<tr>
          <td style="font-weight:600;">${c.filename||'—'}</td>
          <td><span class="badge badge-${(c.risk_score||0)<=30?'success':(c.risk_score||0)<=70?'warning':'danger'}">${c.risk_score||0}/100</span></td>
          <td style="font-size:12px;color:var(--text-muted);">${c.file_size ? (c.file_size/1024).toFixed(1)+'KB' : '—'}</td>
          <td><span class="badge badge-${c.status==='analyzed'?'success':'info'}">${c.status}</span></td>
          <td style="font-size:11px;color:var(--text-muted);">${c.created_at||''}</td>
        </tr>`).join('')}</tbody>
      </table></div>`;
    }
    lucide.createIcons();
  } catch(e) { console.error(e); }
}
