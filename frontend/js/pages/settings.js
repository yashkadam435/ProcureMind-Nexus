// =============================================
// ProcureMind Nexus — Settings & Governance Page
// =============================================

registerPage('settings', async (el) => {
  el.innerHTML = `
    <div class="fade-in">
      <!-- Tabs -->
      <div class="tabs" style="margin-bottom:24px;">
        <div class="tab active" data-tab="policy" onclick="switchSettingsTab('policy')">Spending Policy</div>
        <div class="tab" data-tab="agents" onclick="switchSettingsTab('agents')">Agent Controls</div>
        <div class="tab" data-tab="voice" onclick="switchSettingsTab('voice')">Voice</div>
        <div class="tab" data-tab="compliance" onclick="switchSettingsTab('compliance')">EU AI Act</div>
        <div class="tab" data-tab="audit" onclick="switchSettingsTab('audit')">Audit Trail</div>
        <div class="tab" data-tab="suppliers" onclick="switchSettingsTab('suppliers')">Suppliers</div>
      </div>

      <!-- Tab Content -->
      <div id="settings-tab-content">
        <div class="loading-spinner"></div>
      </div>
    </div>`;
  lucide.createIcons();
  await loadSettingsData();
  switchSettingsTab('policy');
});

let settingsCache = {};
let complianceCache = {};
let auditCache = [];
let suppliersCache = [];

async function loadSettingsData() {
  try {
    const [settings, compliance, audit, suppliers] = await Promise.all([
      api.get('/settings'),
      api.get('/compliance/status'),
      api.get('/compliance/audit?limit=50'),
      api.get('/suppliers'),
    ]);
    settingsCache = settings.settings || {};
    complianceCache = compliance;
    auditCache = audit.audit_trail || [];
    suppliersCache = suppliers.suppliers || [];
  } catch(e) { console.error('Settings load error:', e); }
}

function switchSettingsTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  const el = document.getElementById('settings-tab-content');

  switch(tab) {
    case 'policy': renderPolicyTab(el); break;
    case 'agents': renderAgentControlsTab(el); break;
    case 'voice': renderVoiceTab(el); break;
    case 'compliance': renderComplianceTab(el); break;
    case 'audit': renderAuditTab(el); break;
    case 'suppliers': renderSuppliersTab(el); break;
  }
  lucide.createIcons();
}

function renderPolicyTab(el) {
  const threshold = settingsCache.auto_approve_threshold || '10000';
  const budget = settingsCache.monthly_budget || '500000';
  const hrCats = JSON.parse(settingsCache.high_risk_categories || '[]');
  const allCats = ['IT_services','consulting','legal','raw_materials','logistics','office_supplies'];

  el.innerHTML = `
    <div class="grid grid-2">
      <div class="card">
        <div class="card-title" style="margin-bottom:20px;"><i data-lucide="sliders-horizontal" style="width:18px;height:18px;color:var(--accent);"></i> Approval Thresholds</div>
        <div class="input-group" style="margin-bottom:20px;">
          <label>Auto-Approve Threshold (€)</label>
          <input type="range" id="threshold-slider" min="1000" max="100000" step="1000" value="${threshold}"
                 oninput="document.getElementById('threshold-val').textContent='€'+Number(this.value).toLocaleString('de-DE')"
                 style="width:100%;accent-color:var(--accent);">
          <div style="display:flex;justify-content:space-between;margin-top:6px;">
            <span style="font-size:11px;color:var(--text-muted);">€1,000</span>
            <span style="font-size:16px;font-weight:800;color:var(--accent);" id="threshold-val">€${Number(threshold).toLocaleString('de-DE')}</span>
            <span style="font-size:11px;color:var(--text-muted);">€100,000</span>
          </div>
        </div>
        <div class="input-group" style="margin-bottom:20px;">
          <label>Monthly Budget (€)</label>
          <input type="number" id="budget-input" value="${budget}" min="10000" step="10000">
        </div>
        <button class="btn btn-primary" onclick="savePolicy()"><i data-lucide="save" style="width:14px;height:14px;"></i> Save Policy</button>
      </div>

      <div class="card">
        <div class="card-title" style="margin-bottom:20px;"><i data-lucide="shield-alert" style="width:18px;height:18px;color:var(--warning);"></i> High-Risk Categories</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${allCats.map(c => `
            <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;">
              <div class="toggle">
                <input type="checkbox" class="hr-cat-check" value="${c}" ${hrCats.includes(c)?'checked':''}>
                <span class="toggle-slider"></span>
              </div>
              ${c.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}
            </label>`).join('')}
        </div>
        <div style="margin-top:16px;font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px;">
          <i data-lucide="info" style="width:14px;height:14px;"></i>
          High-risk categories always require human approval
        </div>
      </div>
    </div>`;
}

function renderAgentControlsTab(el) {
  const autoNeg = settingsCache.enable_autonomous_negotiation === 'true';
  const treasury = settingsCache.enable_treasury_rebalance === 'true';

  el.innerHTML = `
    <div class="grid grid-2">
      <div class="card">
        <div class="card-title" style="margin-bottom:20px;"><i data-lucide="cpu" style="width:18px;height:18px;color:var(--accent);"></i> Agent Behavior</div>
        ${agentToggle('enable_autonomous_negotiation', 'Autonomous Negotiation', 'Allow Negotiator Agent to send RFQs without human confirmation', autoNeg)}
        ${agentToggle('enable_treasury_rebalance', 'Treasury Auto-Invest', 'Automatically invest 50% of surplus budget into xStocks ETFs', treasury)}
        ${agentToggle('enable_voice_queries', 'Voice Queries', 'Enable Speechmatics voice input for procurement requests', false)}
        ${agentToggle('enable_x402_payments', 'x402 Micropayments', 'Allow agents to pay for external data via x402 protocol', true)}
      </div>

      <div class="card">
        <div class="card-title" style="margin-bottom:20px;"><i data-lucide="activity" style="width:18px;height:18px;color:var(--success);"></i> Circuit Breakers</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
          <div style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--border);">
            <span class="badge badge-success">Active</span> AI Engine failure threshold: 3 retries
          </div>
          <div style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--border);">
            <span class="badge badge-success">Active</span> Budget exceeded → block all payments
          </div>
          <div style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--border);">
            <span class="badge badge-success">Active</span> Compliance uncertain → default to human
          </div>
          <div style="display:flex;align-items:center;gap:8px;padding:10px 0;">
            <span class="badge badge-success">Active</span> x402 failure → retry once, then notify
          </div>
        </div>
      </div>
    </div>`;
}

async function renderVoiceTab(el) {
  let voiceConf = { mode: 'browser', language: 'en', confidence_threshold: 0.7, supported_languages: [], total_transcriptions: 0, total_audio_seconds: 0 };
  try { voiceConf = await api.get('/voice/config'); } catch(e) {}

  const isLive = voiceConf.mode === 'speechmatics';
  const langs = voiceConf.supported_languages || [{ code:'en', name:'English' }];

  el.innerHTML = `
    <div class="grid grid-2">
      <div class="card">
        <div class="card-title" style="margin-bottom:20px;"><i data-lucide="mic" style="width:18px;height:18px;color:var(--accent);"></i> Voice Configuration</div>
        ${!isLive ? `<div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius-sm);padding:12px;margin-bottom:16px;font-size:12px;color:var(--warning);display:flex;align-items:center;gap:8px;">
          <i data-lucide="alert-triangle" style="width:16px;height:16px;flex-shrink:0;"></i>
          Speechmatics unavailable — using browser fallback. Add API key to enable.
        </div>` : `<div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:var(--radius-sm);padding:12px;margin-bottom:16px;font-size:12px;color:var(--success);display:flex;align-items:center;gap:8px;">
          <i data-lucide="check-circle" style="width:16px;height:16px;flex-shrink:0;"></i>
          Speechmatics connected (API key: ${voiceConf.api_key_hint || '****'})
        </div>`}

        <div class="input-group" style="margin-bottom:16px;">
          <label>Language</label>
          <select id="voice-lang" onchange="updateVoiceSetting('language', this.value)">
            ${langs.map(l => `<option value="${l.code}" ${l.code===voiceConf.language?'selected':''}>${l.name}</option>`).join('')}
          </select>
        </div>

        <div class="input-group" style="margin-bottom:16px;">
          <label>Confidence Threshold</label>
          <input type="range" id="voice-threshold" min="0" max="100" value="${Math.round((voiceConf.confidence_threshold||0.7)*100)}"
                 oninput="document.getElementById('threshold-label').textContent=this.value+'%'"
                 style="width:100%;accent-color:var(--accent);">
          <div style="display:flex;justify-content:space-between;margin-top:4px;">
            <span style="font-size:11px;color:var(--text-muted);">Low (accept all)</span>
            <span style="font-size:13px;font-weight:700;color:var(--accent);" id="threshold-label">${Math.round((voiceConf.confidence_threshold||0.7)*100)}%</span>
            <span style="font-size:11px;color:var(--text-muted);">High (strict)</span>
          </div>
        </div>

        <div style="display:flex;gap:10px;margin-top:16px;">
          <button class="btn btn-primary" onclick="testMicrophone()">
            <i data-lucide="mic" style="width:14px;height:14px;"></i> Test Microphone
          </button>
          <button class="btn btn-secondary" onclick="saveVoiceSettings()">
            <i data-lucide="save" style="width:14px;height:14px;"></i> Save Settings
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-title" style="margin-bottom:20px;"><i data-lucide="activity" style="width:18px;height:18px;color:var(--success);"></i> Voice Stats</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
          <div style="background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;text-align:center;">
            <div style="font-size:24px;font-weight:800;">${voiceConf.total_transcriptions}</div>
            <div style="font-size:11px;color:var(--text-muted);">Transcriptions</div>
          </div>
          <div style="background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;text-align:center;">
            <div style="font-size:24px;font-weight:800;">${voiceConf.total_audio_seconds}s</div>
            <div style="font-size:11px;color:var(--text-muted);">Audio Processed</div>
          </div>
        </div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
          <div style="padding:8px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;">
            <span>Engine</span><span class="badge badge-${isLive?'success':'warning'}">${isLive?'Speechmatics Enhanced':'Browser Fallback'}</span>
          </div>
          <div style="padding:8px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;">
            <span>Model</span><span style="font-weight:600;">${voiceConf.model||'default'}</span>
          </div>
          <div style="padding:8px 0;display:flex;justify-content:space-between;">
            <span>Diarization</span><span class="badge badge-${isLive?'success':'info'}">${isLive?'Speaker ID':'Off'}</span>
          </div>
        </div>
        <div id="mic-test-area" style="margin-top:16px;display:none;">
          <canvas id="mic-test-canvas" width="300" height="50" style="width:100%;height:50px;border-radius:var(--radius-xs);background:rgba(0,0,0,0.2);"></canvas>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px;text-align:center;">Microphone test active…</div>
        </div>
      </div>
    </div>`;
  lucide.createIcons();
}

async function updateVoiceSetting(key, value) {
  // Immediate local update
}

async function saveVoiceSettings() {
  const lang = document.getElementById('voice-lang')?.value;
  const threshold = (document.getElementById('voice-threshold')?.value || 70) / 100;
  try {
    await api.post('/voice/settings', { language: lang, confidence_threshold: threshold });
    showToast('Voice settings saved', 'success');
  } catch(e) { showToast('Failed to save voice settings', 'error'); }
}

async function testMicrophone() {
  const area = document.getElementById('mic-test-area');
  const canvas = document.getElementById('mic-test-canvas');
  if (!area || !canvas) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    area.style.display = 'block';
    const actx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = actx.createAnalyser();
    analyser.fftSize = 128;
    actx.createMediaStreamSource(stream).connect(analyser);
    const ctx = canvas.getContext('2d');
    const bufLen = analyser.frequencyBinCount;
    const data = new Uint8Array(bufLen);
    let running = true;
    function draw() {
      if (!running) return;
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barW = (canvas.width / bufLen) * 2;
      let x = 0;
      for (let i = 0; i < bufLen; i++) {
        const h = (data[i] / 255) * canvas.height;
        ctx.fillStyle = `hsla(${140 + (data[i]/255)*100}, 70%, 55%, 0.8)`;
        ctx.fillRect(x, canvas.height - h, barW - 1, h);
        x += barW;
      }
    }
    draw();
    showToast('🎙️ Microphone test active — speak to see waveform', 'info');
    setTimeout(() => { running = false; stream.getTracks().forEach(t => t.stop()); actx.close(); area.style.display = 'none'; showToast('Mic test complete', 'success'); }, 5000);
  } catch(e) {
    showToast('Microphone access denied', 'error');
  }
}

function renderComplianceTab(el) {
  const c = complianceCache;
  el.innerHTML = `
    <div class="grid grid-2">
      <div class="card" style="text-align:center;">
        <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Compliance Score</div>
        <div style="position:relative;width:160px;height:160px;margin:0 auto;">
          <svg viewBox="0 0 36 36" style="width:160px;height:160px;transform:rotate(-90deg);">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2.5"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"
                    stroke-dasharray="${c.compliance_score||98} ${100-(c.compliance_score||98)}" style="transition:stroke-dasharray 2s ease;"/>
          </svg>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
            <div style="font-size:36px;font-weight:900;color:var(--success);">${c.compliance_score||98}%</div>
            <div style="font-size:11px;color:var(--text-muted);">EU AI Act</div>
          </div>
        </div>
        <div style="display:flex;justify-content:center;gap:20px;margin-top:20px;">
          <div style="text-align:center;">
            <div style="font-size:20px;font-weight:800;">${c.audit_entries||0}</div>
            <div style="font-size:11px;color:var(--text-muted);">Audit Entries</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:20px;font-weight:800;">${c.human_approvals||0}</div>
            <div style="font-size:11px;color:var(--text-muted);">Human Approvals</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:20px;font-weight:800;">${c.pending_approvals||0}</div>
            <div style="font-size:11px;color:var(--text-muted);">Pending</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title" style="margin-bottom:16px;"><i data-lucide="scroll-text" style="width:18px;height:18px;color:var(--info);"></i> Article Compliance</div>
        ${(c.articles||[]).map(a => `
          <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);">
            <span class="badge badge-${a.status==='compliant'?'success':'warning'}">${a.status==='compliant'?'✅':'⚠️'}</span>
            <div>
              <div style="font-size:13px;font-weight:600;">${a.article}</div>
              <div style="font-size:12px;color:var(--text-muted);">${a.desc}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}

function renderAuditTab(el) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i data-lucide="scroll" style="width:18px;height:18px;color:var(--accent);"></i> Immutable Audit Trail <span style="font-size:11px;color:var(--text-muted);margin-left:8px;">(Hash-chained)</span></div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-sm btn-secondary" onclick="exportAudit('json')"><i data-lucide="download" style="width:14px;height:14px;"></i> JSON</button>
          <button class="btn btn-sm btn-secondary" onclick="exportAudit('csv')"><i data-lucide="file-spreadsheet" style="width:14px;height:14px;"></i> CSV</button>
        </div>
      </div>
      ${auditCache.length > 0 ? `
        <div class="table-container"><table>
          <thead><tr><th>Timestamp</th><th>Agent</th><th>Action</th><th>Details</th><th>Hash</th></tr></thead>
          <tbody>${auditCache.map(a => `<tr>
            <td style="font-size:11px;color:var(--text-muted);white-space:nowrap;">${a.created_at||''}</td>
            <td><span class="badge badge-info">${a.agent_name||'—'}</span></td>
            <td style="font-size:12px;font-weight:600;">${a.action||'—'}</td>
            <td style="font-size:11px;max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${typeof a.details==='object'?JSON.stringify(a.details):a.details||''}</td>
            <td style="font-family:monospace;font-size:10px;color:var(--text-muted);max-width:100px;overflow:hidden;text-overflow:ellipsis;">${(a.entry_hash||'').slice(0,16)}…</td>
          </tr>`).join('')}</tbody>
        </table></div>` : '<div class="empty-state"><i data-lucide="shield-off"></i><h3>No Audit Entries</h3><p>Actions will be logged here as agents operate</p></div>'}
    </div>`;
}

function renderSuppliersTab(el) {
  const srcBadge = (s) => {
    const map = { internal_db:['Internal','success'], web_search:['Web','info'], trade_directory:['Directory','purple'] };
    const [label, cls] = map[s.source] || ['Unknown','warning'];
    return `<span class="badge badge-${cls}">${label}</span>`;
  };
  const nameLink = (s) => {
    if (s.source_url) return `<a href="${s.source_url}" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:none;font-weight:600;" title="Open supplier website">${s.name}</a>`;
    return `<span style="font-weight:600;">${s.name}</span>`;
  };
  const verifyBtn = (s) => {
    if (s.source_url) return '';
    return `<button class="btn btn-sm btn-secondary" onclick="verifySupplier('${s.id}','${s.name}')" style="padding:3px 8px;font-size:10px;gap:4px;"><i data-lucide="search" style="width:10px;height:10px;"></i>Verify</button>`;
  };

  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i data-lucide="factory" style="width:18px;height:18px;color:var(--info);"></i> Supplier Database</div>
        <span class="badge badge-info">${suppliersCache.length} suppliers</span>
      </div>
      ${suppliersCache.length > 0 ? `
        <div class="table-container"><table>
          <thead><tr><th>Supplier</th><th>Category</th><th>Location</th><th>Score</th><th>Risk</th><th>Delivery</th><th>Source</th><th>Certifications</th><th></th></tr></thead>
          <tbody>${suppliersCache.map(s => `<tr style="cursor:pointer;" onclick="showSupplierDetail('${s.id}')">
            <td>
              <div>${nameLink(s)}</div>
              <div style="font-size:11px;color:var(--text-muted);">${s.contact_email||''}</div>
            </td>
            <td><span class="badge badge-purple">${s.category||'—'}</span></td>
            <td style="font-size:12px;">${s.location||'—'}</td>
            <td><span class="badge badge-${s.capability_score>=85?'success':s.capability_score>=70?'warning':'danger'}">${s.capability_score}/100</span></td>
            <td><span class="badge badge-${s.risk_rating<=20?'success':s.risk_rating<=40?'warning':'danger'}">${s.risk_rating}</span></td>
            <td>${s.avg_delivery_days||'—'} days</td>
            <td>${srcBadge(s)}</td>
            <td style="font-size:11px;">${(s.certifications||[]).join(', ')}</td>
            <td onclick="event.stopPropagation();">${verifyBtn(s)}</td>
          </tr>`).join('')}</tbody>
        </table></div>` : '<div class="empty-state"><i data-lucide="factory"></i><h3>No Suppliers</h3></div>'}
    </div>
    <!-- Supplier Detail Drawer -->
    <div id="supplier-drawer" style="position:fixed;top:0;right:0;bottom:0;width:420px;max-width:90vw;background:var(--bg-secondary);border-left:1px solid var(--border);z-index:1000;transform:translateX(100%);transition:transform 0.3s ease;box-shadow:-10px 0 40px rgba(0,0,0,0.4);overflow-y:auto;padding:0;">
      <div id="supplier-drawer-content"></div>
    </div>
    <div id="supplier-drawer-overlay" onclick="closeSupplierDrawer()" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999;display:none;"></div>`;
}

function showSupplierDetail(id) {
  const s = suppliersCache.find(x => x.id === id);
  if (!s) return;
  const certs = s.certifications || [];
  const perf = typeof s.past_performance === 'string' ? JSON.parse(s.past_performance || '{}') : (s.past_performance || {});
  const srcMap = { internal_db:'Internal Database', web_search:'Web Search', trade_directory:'Trade Directory' };
  const srcBadgeMap = { internal_db:'success', web_search:'info', trade_directory:'purple' };

  document.getElementById('supplier-drawer-content').innerHTML = `
    <div style="padding:24px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
        <h3 style="font-size:18px;font-weight:700;">${s.name}</h3>
        <button class="topbar-btn" onclick="closeSupplierDrawer()" style="width:28px;height:28px;"><i data-lucide="x" style="width:14px;height:14px;"></i></button>
      </div>

      <div style="display:flex;gap:8px;margin-bottom:20px;">
        <span class="badge badge-purple">${s.category||'General'}</span>
        <span class="badge badge-${srcBadgeMap[s.source]||'info'}">${srcMap[s.source]||'Unknown'}</span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
        <div style="background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;">
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Capability</div>
          <div style="font-size:24px;font-weight:800;color:var(--success);margin-top:4px;">${s.capability_score}/100</div>
        </div>
        <div style="background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;">
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Risk Rating</div>
          <div style="font-size:24px;font-weight:800;color:${s.risk_rating<=20?'var(--success)':s.risk_rating<=40?'var(--warning)':'var(--danger)'};margin-top:4px;">${s.risk_rating}</div>
        </div>
        <div style="background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;">
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Avg Delivery</div>
          <div style="font-size:24px;font-weight:800;margin-top:4px;">${s.avg_delivery_days} days</div>
        </div>
        <div style="background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;">
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Location</div>
          <div style="font-size:14px;font-weight:600;margin-top:4px;">${s.location||'—'}</div>
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <h4 style="font-size:13px;font-weight:700;margin-bottom:10px;">Contact</h4>
        <div style="font-size:13px;color:var(--text-secondary);line-height:2;">
          ${s.contact_email ? `<div><i data-lucide="mail" style="width:13px;height:13px;vertical-align:middle;margin-right:6px;"></i>${s.contact_email}</div>` : ''}
          ${s.website ? `<div><i data-lucide="globe" style="width:13px;height:13px;vertical-align:middle;margin-right:6px;"></i><a href="${s.website}" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:none;">${s.website}</a></div>` : ''}
          ${s.source_url && s.source_url !== s.website ? `<div><i data-lucide="external-link" style="width:13px;height:13px;vertical-align:middle;margin-right:6px;"></i><a href="${s.source_url}" target="_blank" rel="noopener" style="color:var(--info);text-decoration:none;">Source: ${s.source_url}</a></div>` : ''}
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <h4 style="font-size:13px;font-weight:700;margin-bottom:10px;">Certifications</h4>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${certs.length > 0 ? certs.map(c => `<span class="badge badge-success" style="font-size:11px;">${c}</span>`).join('') : '<span style="font-size:12px;color:var(--text-muted);">No certifications listed</span>'}
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <h4 style="font-size:13px;font-weight:700;margin-bottom:10px;">Performance History</h4>
        <div style="display:flex;gap:4px;align-items:flex-end;height:80px;">
          ${[85,78,92,88,90,95,87,91,93,89,94,92].map((v,i) =>
            `<div style="flex:1;background:${i===11?'var(--accent)':'rgba(99,102,241,0.3)'};height:${v*0.8}%;border-radius:3px 3px 0 0;transition:height 0.5s ease ${i*50}ms;" title="Month ${i+1}: ${v}%"></div>`
          ).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-top:4px;">
          <span>Jan</span><span>Jun</span><span>Dec</span>
        </div>
      </div>

      ${s.source_url ? `<a href="${s.source_url}" target="_blank" rel="noopener" class="btn btn-primary" style="width:100%;justify-content:center;">
        <i data-lucide="external-link" style="width:14px;height:14px;"></i> Visit Supplier Website
      </a>` : `<button class="btn btn-secondary" style="width:100%;justify-content:center;" onclick="verifySupplier('${s.id}','${s.name}')">
        <i data-lucide="search" style="width:14px;height:14px;"></i> Verify Supplier URL
      </button>`}
    </div>`;

  document.getElementById('supplier-drawer').style.transform = 'translateX(0)';
  document.getElementById('supplier-drawer-overlay').style.display = 'block';
  if (window.lucide) lucide.createIcons();
}

function closeSupplierDrawer() {
  document.getElementById('supplier-drawer').style.transform = 'translateX(100%)';
  document.getElementById('supplier-drawer-overlay').style.display = 'none';
}

async function verifySupplier(id, name) {
  showToast(`Searching for ${name} website…`, 'info');
  try {
    const results = await api.get('/suppliers/search?q=' + encodeURIComponent(name));
    const match = (results.suppliers || []).find(s => s.id === id);
    if (match && match.website) {
      showToast(`Found: ${match.website}`, 'success');
    } else {
      showToast(`No verified URL found for ${name}. Try manual search.`, 'info');
    }
  } catch(e) { showToast('Verification failed', 'error'); }
}

function agentToggle(key, label, desc, checked) {
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--border);">
      <div>
        <div style="font-size:13px;font-weight:600;">${label}</div>
        <div style="font-size:11px;color:var(--text-muted);">${desc}</div>
      </div>
      <label class="toggle">
        <input type="checkbox" ${checked?'checked':''} onchange="saveSetting('${key}', this.checked?'true':'false')">
        <span class="toggle-slider"></span>
      </label>
    </div>`;
}

async function savePolicy() {
  const threshold = document.getElementById('threshold-slider').value;
  const budget = document.getElementById('budget-input').value;
  const cats = Array.from(document.querySelectorAll('.hr-cat-check:checked')).map(c => c.value);

  try {
    await Promise.all([
      api.post('/settings', { key: 'auto_approve_threshold', value: threshold }),
      api.post('/settings', { key: 'monthly_budget', value: budget }),
      api.post('/settings', { key: 'high_risk_categories', value: JSON.stringify(cats) }),
    ]);
    settingsCache.auto_approve_threshold = threshold;
    settingsCache.monthly_budget = budget;
    settingsCache.high_risk_categories = JSON.stringify(cats);
    showToast('Policy saved successfully', 'success');
  } catch(e) { showToast('Failed to save: '+e.message, 'error'); }
}

async function saveSetting(key, value) {
  try {
    await api.post('/settings', { key, value });
    settingsCache[key] = value;
    showToast(`${key.replace(/_/g,' ')} updated`, 'success');
  } catch(e) { showToast('Save failed', 'error'); }
}

function exportAudit(format) {
  const data = auditCache;
  let content, mime, ext;
  if (format === 'json') {
    content = JSON.stringify(data, null, 2);
    mime = 'application/json';
    ext = 'json';
  } else {
    const headers = 'timestamp,agent,action,details,hash\n';
    const rows = data.map(a => `"${a.created_at}","${a.agent_name}","${a.action}","${typeof a.details==='object'?JSON.stringify(a.details).replace(/"/g,'""'):a.details}","${a.entry_hash}"`).join('\n');
    content = headers + rows;
    mime = 'text/csv';
    ext = 'csv';
  }
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `procuremind_audit_${new Date().toISOString().slice(0,10)}.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`Audit exported as ${ext.toUpperCase()}`, 'success');
}
