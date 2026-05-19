// =============================================
// ProcureMind Nexus — Procurement Workflow Page
// =============================================

registerPage('procure', async (el) => {
  el.innerHTML = `
    <div class="fade-in">
      <!-- Input Card -->
      <div class="card" style="margin-bottom:24px;">
        <div class="card-header">
          <div class="card-title"><i data-lucide="message-square-text" style="width:18px;height:18px;color:var(--accent);"></i> New Procurement Request</div>
        </div>
        <div class="input-group" style="margin-bottom:16px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <label>Describe what you need</label>
            <button class="btn btn-sm" id="voice-btn" onclick="toggleVoiceInput()" style="background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.3);gap:6px;">
              <i data-lucide="mic" style="width:14px;height:14px;"></i> Voice Input
            </button>
          </div>
          <textarea id="procure-input" placeholder='e.g., "I need 500 CNC aluminum brackets, max €45 per unit, delivery within 2 weeks"' rows="3"></textarea>
          <div id="voice-status" style="display:none;font-size:11px;margin-top:6px;color:#ef4444;">
            <span class="dot" style="background:#ef4444;animation:pulse 1s infinite;"></span> Listening… speak your procurement request
          </div>
          <canvas id="voice-waveform" width="600" height="40" style="display:none;width:100%;height:40px;margin-top:8px;border-radius:var(--radius-xs);background:rgba(0,0,0,0.2);"></canvas>
        </div>
        <div class="grid grid-3" style="margin-bottom:20px;">
          <div class="input-group">
            <label>Budget (€)</label>
            <input type="number" id="procure-budget" value="50000" min="100" step="1000">
          </div>
          <div class="input-group">
            <label>Category</label>
            <select id="procure-category">
              <option value="general">General</option>
              <option value="CNC Manufacturing">CNC Manufacturing</option>
              <option value="Metal Fabrication">Metal Fabrication</option>
              <option value="IT_services">IT Services</option>
              <option value="consulting">Consulting</option>
              <option value="office_supplies">Office Supplies</option>
              <option value="raw_materials">Raw Materials</option>
            </select>
          </div>
          <div class="input-group" style="display:flex;align-items:flex-end;">
            <button class="btn btn-primary" id="procure-btn" onclick="startProcurement()" style="width:100%;">
              <i data-lucide="rocket" style="width:16px;height:16px;"></i> Launch Procurement
            </button>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <span style="font-size:11px;color:var(--text-muted);margin-right:4px;">Quick:</span>
          <button class="btn btn-sm btn-secondary" onclick="fillQuick('500 CNC aluminum brackets, max €45/unit, 2-week delivery','50000','CNC Manufacturing')">CNC Brackets</button>
          <button class="btn btn-sm btn-secondary" onclick="fillQuick('100 stainless steel bolts M12x50, DIN 931, max €2/unit','5000','Metal Fabrication')">Steel Bolts</button>
          <button class="btn btn-sm btn-secondary" onclick="fillQuick('IT infrastructure audit for 200-seat office, Q3 2026','25000','IT_services')">IT Audit</button>
          <button class="btn btn-sm btn-secondary" onclick="fillQuick('1000 custom packaging boxes, 300x200x150mm, recycled cardboard','15000','general')">Packaging</button>
        </div>
      </div>

      <!-- Workflow Progress -->
      <div class="card" id="workflow-progress-card" style="margin-bottom:24px;display:none;">
        <div class="card-header">
          <div class="card-title"><i data-lucide="workflow" style="width:18px;height:18px;color:var(--info);"></i> Workflow Progress</div>
          <span class="badge badge-info" id="wf-status-badge">Running</span>
        </div>
        <div class="workflow-steps" id="workflow-steps"></div>
      </div>

      <!-- Results Panels -->
      <div id="procure-results" style="display:none;">
        <!-- Parsed Request -->
        <div class="card" style="margin-bottom:24px;" id="parsed-card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="scan" style="width:18px;height:18px;color:var(--accent);"></i> Parsed Request</div>
          </div>
          <div id="parsed-content"></div>
        </div>

        <!-- Suppliers -->
        <div class="card" style="margin-bottom:24px;">
          <div class="card-header">
            <div class="card-title"><i data-lucide="search" style="width:18px;height:18px;color:#3b82f6;"></i> Supplier Discovery</div>
            <span class="badge badge-success" id="supplier-count">0 found</span>
          </div>
          <div id="suppliers-content"></div>
        </div>

        <!-- Compliance -->
        <div class="card" style="margin-bottom:24px;">
          <div class="card-header">
            <div class="card-title"><i data-lucide="shield-check" style="width:18px;height:18px;color:#10b981;"></i> Compliance Check</div>
          </div>
          <div id="compliance-content"></div>
        </div>

        <!-- Negotiation -->
        <div class="card" style="margin-bottom:24px;">
          <div class="card-header">
            <div class="card-title"><i data-lucide="handshake" style="width:18px;height:18px;color:#f59e0b;"></i> Negotiation Strategy</div>
          </div>
          <div id="negotiation-content"></div>
        </div>
      </div>

      <!-- Past Workflows -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i data-lucide="history" style="width:18px;height:18px;color:var(--text-muted);"></i> Procurement History</div>
        </div>
        <div id="proc-history"></div>
      </div>
    </div>`;
  lucide.createIcons();
  loadProcureHistory();
});

function fillQuick(text, budget, category) {
  document.getElementById('procure-input').value = text;
  document.getElementById('procure-budget').value = budget;
  const sel = document.getElementById('procure-category');
  for (let i = 0; i < sel.options.length; i++) {
    if (sel.options[i].value === category) { sel.selectedIndex = i; break; }
  }
}

async function startProcurement() {
  const text = document.getElementById('procure-input').value.trim();
  if (!text) { showToast('Please describe your procurement needs', 'error'); return; }
  const budget = parseFloat(document.getElementById('procure-budget').value) || 50000;
  const category = document.getElementById('procure-category').value;

  const btn = document.getElementById('procure-btn');
  btn.disabled = true;
  btn.innerHTML = '<div class="loading-spinner" style="width:18px;height:18px;margin:0;border-width:2px;"></div> Agents Working…';

  // Show progress
  const steps = ['Parse','Comply','Scout','Analyze','Negotiate','Payment','Audit'];
  document.getElementById('workflow-progress-card').style.display = 'block';
  renderWorkflowSteps(steps, 0);

  try {
    // Animate steps
    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, 3);
      renderWorkflowSteps(steps, stepIdx);
    }, 2500);

    const result = await api.post('/procure', { request_text: text, budget, category });
    clearInterval(stepInterval);

    // Final step state
    const finalStep = result.status === 'completed' ? steps.length : 5;
    renderWorkflowSteps(steps, finalStep);

    document.getElementById('wf-status-badge').textContent = result.status;
    document.getElementById('wf-status-badge').className = `badge badge-${result.status==='completed'?'success':result.status==='paused'?'warning':'info'}`;

    // Show results
    document.getElementById('procure-results').style.display = 'block';

    // Parsed
    const p = result.parsed_request || {};
    document.getElementById('parsed-content').innerHTML = `
      <div class="grid grid-4" style="gap:12px;">
        ${infoTile('Item', p.item||'—')}
        ${infoTile('Quantity', p.quantity||'—')}
        ${infoTile('Max Price', p.max_price_per_unit ? `€${p.max_price_per_unit}` : '—')}
        ${infoTile('Priority', `<span class="badge badge-${p.priority==='high'?'danger':p.priority==='medium'?'warning':'success'}">${p.priority||'medium'}</span>`)}
      </div>
      ${p.specifications ? `<div style="margin-top:12px;font-size:12px;color:var(--text-muted);">Specs: ${(p.specifications||[]).join(', ')}</div>` : ''}`;

    // Suppliers
    const suppliers = result.suppliers || [];
    document.getElementById('supplier-count').textContent = `${suppliers.length} found`;
    if (suppliers.length > 0) {
      document.getElementById('suppliers-content').innerHTML = `
        <div class="table-container"><table>
          <thead><tr><th>Supplier</th><th>Location</th><th>Score</th><th>Risk</th><th>Delivery</th><th>Price Est.</th><th>Source</th><th>Fit</th></tr></thead>
          <tbody>${suppliers.map(s => {
            const srcMap = { internal_db:['Internal','success'], web_search:['Web','info'], trade_directory:['Directory','purple'] };
            const [srcLabel,srcCls] = srcMap[s.source] || ['DB','success'];
            const nameHtml = s.source_url ? `<a href="${s.source_url}" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:none;font-weight:600;">${s.name}</a>` : `<span style="font-weight:600;">${s.name}</span>`;
            return `<tr>
            <td><div>${nameHtml}</div><div style="font-size:11px;color:var(--text-muted);">${(s.certifications||[]).join(', ')}</div></td>
            <td>${s.location||'—'}</td>
            <td><span class="badge badge-${s.capability_score>=85?'success':s.capability_score>=70?'warning':'danger'}">${s.capability_score}/100</span></td>
            <td><span class="badge badge-${s.risk_rating<=20?'success':s.risk_rating<=40?'warning':'danger'}">${s.risk_rating}</span></td>
            <td>${s.avg_delivery_days||'—'} days</td>
            <td style="font-weight:600;">${s.price_estimate?`€${s.price_estimate}`:'—'}</td>
            <td><span class="badge badge-${srcCls}">${srcLabel}</span></td>
            <td>${s.fit_score?`<span class="badge badge-purple">${s.fit_score}</span>`:''}</td>
          </tr>`}).join('')}</tbody>
        </table></div>`;
    } else {
      document.getElementById('suppliers-content').innerHTML = '<div class="empty-state"><p>No suppliers found</p></div>';
    }

    // Compliance
    const comp = result.compliance || {};
    document.getElementById('compliance-content').innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <span class="badge badge-${comp.authorized?'success':'warning'}" style="font-size:13px;padding:6px 14px;">
          ${comp.authorized ? '✅ Auto-Approved' : '⚠️ Human Approval Required'}
        </span>
        ${comp.eu_ai_act_compliant ? '<span class="badge badge-success">EU AI Act Compliant</span>' : ''}
      </div>
      ${(comp.reasons||[]).length > 0 ? `<ul style="font-size:13px;color:var(--text-secondary);list-style:disc;padding-left:20px;">${comp.reasons.map(r=>`<li>${r}</li>`).join('')}</ul>` : ''}
      ${result.approval_id ? `<div style="margin-top:12px;"><button class="btn btn-sm btn-success" onclick="approveItem('${result.approval_id}','approved')"><i data-lucide="check" style="width:14px;height:14px;"></i> Approve</button> <button class="btn btn-sm btn-danger" onclick="approveItem('${result.approval_id}','denied')"><i data-lucide="x" style="width:14px;height:14px;"></i> Deny</button></div>` : ''}`;

    // Negotiation
    const neg = result.negotiation?.negotiation || result.negotiation || {};
    document.getElementById('negotiation-content').innerHTML = `
      ${neg.strategy ? `<div style="font-size:13px;margin-bottom:12px;line-height:1.7;color:var(--text-secondary);">${neg.strategy}</div>` : ''}
      ${neg.recommended_supplier ? `
        <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:var(--radius-sm);padding:16px;margin-bottom:12px;">
          <div style="font-size:13px;font-weight:700;color:var(--accent);margin-bottom:6px;">🏆 Recommended: ${neg.recommended_supplier.name||'—'}</div>
          <div style="font-size:12px;color:var(--text-secondary);">${neg.recommended_supplier.reason||''}</div>
          ${neg.recommended_supplier.final_recommended_price ? `<div style="font-size:20px;font-weight:800;margin-top:8px;">€${neg.recommended_supplier.final_recommended_price}</div>` : ''}
          ${neg.recommended_supplier.estimated_savings ? `<div style="font-size:12px;color:var(--success);">💰 Est. savings: ${neg.recommended_supplier.estimated_savings}</div>` : ''}
        </div>` : ''}
      ${neg.rfq_draft ? `
        <div class="accordion-item">
          <div class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
            <span>📧 RFQ Draft Email</span><i data-lucide="chevron-down" style="width:16px;height:16px;"></i>
          </div>
          <div class="accordion-body">
            <div style="font-size:13px;font-weight:600;margin-bottom:4px;">${neg.rfq_draft.subject||''}</div>
            <pre style="font-size:12px;color:var(--text-secondary);white-space:pre-wrap;line-height:1.6;">${neg.rfq_draft.body||''}</pre>
          </div>
        </div>` : ''}`;

    showToast(`Procurement ${result.status}: ${result.workflow_id?.slice(0,8)}`, result.status==='completed'?'success':'info');
    lucide.createIcons();
    loadProcureHistory();
  } catch(err) {
    showToast('Procurement failed: '+err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i data-lucide="rocket" style="width:16px;height:16px;"></i> Launch Procurement';
    lucide.createIcons();
  }
}

function renderWorkflowSteps(steps, activeIdx) {
  const el = document.getElementById('workflow-steps');
  el.innerHTML = steps.map((s, i) => {
    const state = i < activeIdx ? 'completed' : i === activeIdx ? 'active' : 'pending';
    const icons = { Parse:'scan', Comply:'shield-check', Scout:'search', Analyze:'scan-search', Negotiate:'handshake', Payment:'wallet', Audit:'file-check' };
    return `
      ${i>0?`<div class="wf-connector ${i<=activeIdx?'completed':''}"></div>`:''}
      <div class="wf-step ${state}">
        <div class="wf-step-icon">${state==='completed'?'<i data-lucide="check" style="width:16px;height:16px;"></i>':`<i data-lucide="${icons[s]||'circle'}" style="width:16px;height:16px;"></i>`}</div>
        <div class="wf-step-label">${s}</div>
      </div>`;
  }).join('');
  lucide.createIcons();
}

function infoTile(label, value) {
  return `<div style="background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;">
    <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">${label}</div>
    <div style="font-size:15px;font-weight:700;">${value}</div>
  </div>`;
}

async function loadProcureHistory() {
  try {
    const data = await api.get('/workflows');
    const wfs = data.workflows || [];
    const el = document.getElementById('proc-history');
    if (!el) return;
    if (wfs.length === 0) {
      el.innerHTML = '<div class="empty-state"><i data-lucide="inbox"></i><h3>No History</h3><p>Your completed workflows will appear here</p></div>';
    } else {
      el.innerHTML = `<div class="table-container"><table>
        <thead><tr><th>ID</th><th>Request</th><th>Status</th><th>Budget</th><th>Created</th></tr></thead>
        <tbody>${wfs.slice(0,10).map(w => `<tr>
          <td style="font-family:monospace;font-size:11px;">${(w.id||'').slice(0,8)}</td>
          <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${w.request_text||''}</td>
          <td><span class="badge badge-${w.status==='completed'?'success':w.status==='paused'?'warning':'info'}">${w.status}</span></td>
          <td>€${Number(w.total_budget||0).toLocaleString('de-DE')}</td>
          <td style="font-size:11px;color:var(--text-muted);">${w.created_at||''}</td>
        </tr>`).join('')}</tbody>
      </table></div>`;
    }
    lucide.createIcons();
  } catch(e) { console.error(e); }
}

// === Voice Input (Speechmatics WebSocket + Browser Fallback) ===
let _voiceRecognition = null;
let _isListening = false;
let _audioContext = null;
let _analyser = null;
let _mediaStream = null;
let _waveformRAF = null;
let _voiceConfig = null;

async function loadVoiceConfig() {
  try { _voiceConfig = await api.get('/voice/config'); } catch(e) { _voiceConfig = { mode: 'browser' }; }
}

function toggleVoiceInput() {
  if (_isListening) { stopVoice(); } else { startVoice(); }
}

async function startVoice() {
  if (!_voiceConfig) await loadVoiceConfig();
  const btn = document.getElementById('voice-btn');
  const status = document.getElementById('voice-status');
  const input = document.getElementById('procure-input');

  // Start audio capture for waveform
  try {
    _mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1 } });
    _audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
    _analyser = _audioContext.createAnalyser();
    _analyser.fftSize = 256;
    const source = _audioContext.createMediaStreamSource(_mediaStream);
    source.connect(_analyser);
    drawWaveform();
  } catch(e) {
    showToast('Microphone access denied', 'error');
    return;
  }

  btn.style.background = 'rgba(239,68,68,0.3)';
  btn.innerHTML = '<i data-lucide="mic-off" style="width:14px;height:14px;"></i> Stop';
  if (status) { status.style.display = 'flex'; status.innerHTML = '<span class="dot" style="background:#ef4444;animation:pulse 1s infinite;"></span> Listening…'; }
  _isListening = true;
  if (window.lucide) lucide.createIcons();

  if (_voiceConfig.mode === 'speechmatics' && _voiceConfig.ws_auth_url) {
    startSpeechmaticsStream(input);
  } else {
    if (_voiceConfig.mode !== 'browser') {
      showToast('Speechmatics unavailable — using browser fallback', 'info');
    }
    startBrowserSpeech(input);
  }
}

function startSpeechmaticsStream(input) {
  try {
    const ws = new WebSocket(_voiceConfig.ws_auth_url);
    _voiceRecognition = ws;
    let finalText = '';

    ws.onopen = () => {
      ws.send(JSON.stringify(_voiceConfig.ws_config_message));
      showToast('🎙️ Speechmatics connected — speak now', 'info');
      // Stream audio via ScriptProcessor
      const processor = _audioContext.createScriptProcessor(4096, 1, 1);
      const source = _audioContext.createMediaStreamSource(_mediaStream);
      source.connect(processor);
      processor.connect(_audioContext.destination);
      processor.onaudioprocess = (e) => {
        if (ws.readyState === WebSocket.OPEN) {
          const float32 = e.inputBuffer.getChannelData(0);
          ws.send(float32.buffer);
        }
      };
      ws._processor = processor;
      ws._source = source;
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.message === 'AddPartialTranscript' && msg.results) {
          const partial = msg.results.map(r => r.alternatives?.[0]?.content || '').join(' ');
          input.value = finalText + partial;
        } else if (msg.message === 'AddTranscript' && msg.results) {
          const final = msg.results.map(r => r.alternatives?.[0]?.content || '').join(' ');
          finalText += final + ' ';
          input.value = finalText;
        } else if (msg.message === 'RecognitionStarted') {
          const statusEl = document.getElementById('voice-status');
          if (statusEl) statusEl.innerHTML = '<span class="dot" style="background:#10b981;animation:pulse 1s infinite;"></span> Speechmatics streaming…';
        }
      } catch(err) {}
    };

    ws.onerror = (e) => {
      console.warn('Speechmatics WS error, falling back to browser', e);
      showToast('Speechmatics error — switching to browser fallback', 'info');
      stopVoice();
      setTimeout(() => { startBrowserSpeech(input); _isListening = true; }, 500);
    };

    ws.onclose = async () => {
      if (ws._processor) { ws._processor.disconnect(); }
      if (ws._source) { ws._source.disconnect(); }
      _isListening = false;
      resetVoiceUI();
      if (finalText.trim()) {
        await processVoiceResult(finalText.trim(), input);
      }
    };
  } catch(e) {
    showToast('Speechmatics connection failed — using browser fallback', 'info');
    startBrowserSpeech(input);
  }
}

function startBrowserSpeech(input) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast('Voice input not supported in this browser', 'error');
    stopVoice();
    return;
  }

  _voiceRecognition = new SpeechRecognition();
  _voiceRecognition.continuous = false;
  _voiceRecognition.interimResults = true;
  _voiceRecognition.lang = (_voiceConfig && _voiceConfig.language) || 'en-US';
  let finalText = '';

  _voiceRecognition.onresult = (event) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalText += event.results[i][0].transcript + ' ';
      } else {
        interim += event.results[i][0].transcript;
      }
    }
    input.value = finalText + interim;
  };

  _voiceRecognition.onend = async () => {
    _isListening = false;
    resetVoiceUI();
    if (finalText.trim()) {
      await processVoiceResult(finalText.trim(), input);
    }
  };

  _voiceRecognition.onerror = (event) => {
    console.error('Voice error:', event.error);
    stopVoice();
    if (event.error === 'not-allowed') {
      showToast('Microphone access denied — check browser permissions', 'error');
    } else {
      showToast(`Voice error: ${event.error}`, 'error');
    }
  };

  _voiceRecognition.start();
  showToast('🎙️ Browser listening… speak your request', 'info');
}

async function processVoiceResult(text, input) {
  showToast('Processing voice command with AI…', 'info');
  try {
    const parsed = await api.post('/voice/process', { text });
    if (parsed.request_text) input.value = parsed.request_text;
    if (parsed.budget) document.getElementById('procure-budget').value = parsed.budget;
    if (parsed.category) {
      const sel = document.getElementById('procure-category');
      for (let i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === parsed.category) { sel.selectedIndex = i; break; }
      }
    }
    showToast(`Voice parsed: "${parsed.item || text.slice(0,40)}"`, 'success');
  } catch(e) {
    console.error('Voice parse error:', e);
  }
}

function drawWaveform() {
  const canvas = document.getElementById('voice-waveform');
  if (!canvas || !_analyser) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  const bufLen = _analyser.frequencyBinCount;
  const data = new Uint8Array(bufLen);

  function draw() {
    if (!_isListening) { canvas.style.display = 'none'; return; }
    _waveformRAF = requestAnimationFrame(draw);
    _analyser.getByteFrequencyData(data);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barW = (canvas.width / bufLen) * 2.5;
    let x = 0;
    for (let i = 0; i < bufLen; i++) {
      const h = (data[i] / 255) * canvas.height;
      const hue = 240 + (data[i] / 255) * 30;
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
      ctx.fillRect(x, canvas.height - h, barW - 1, h);
      x += barW;
    }
  }
  draw();
}

function resetVoiceUI() {
  const btn = document.getElementById('voice-btn');
  const status = document.getElementById('voice-status');
  if (btn) {
    btn.style.background = 'rgba(239,68,68,0.1)';
    btn.innerHTML = '<i data-lucide="mic" style="width:14px;height:14px;"></i> Voice Input';
    if (window.lucide) lucide.createIcons();
  }
  if (status) status.style.display = 'none';
}

function stopVoice() {
  if (_voiceRecognition) {
    if (_voiceRecognition instanceof WebSocket) {
      _voiceRecognition.send(JSON.stringify({ message: "EndOfStream" }));
      setTimeout(() => { try { _voiceRecognition.close(); } catch(e){} }, 500);
    } else {
      _voiceRecognition.stop();
    }
    _voiceRecognition = null;
  }
  if (_waveformRAF) { cancelAnimationFrame(_waveformRAF); _waveformRAF = null; }
  if (_mediaStream) { _mediaStream.getTracks().forEach(t => t.stop()); _mediaStream = null; }
  if (_audioContext) { _audioContext.close().catch(()=>{}); _audioContext = null; _analyser = null; }
  _isListening = false;
  resetVoiceUI();
}
