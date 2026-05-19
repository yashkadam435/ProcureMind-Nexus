// ProcureMind Nexus - SPA Router
const routes = {};
let currentPage = '';

function registerPage(name, renderFn) { routes[name] = renderFn; }

function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page);
  });
  const content = document.getElementById('page-content');
  if (content && routes[page]) {
    content.innerHTML = '<div class="loading-spinner"></div>';
    try {
      const result = routes[page](content);
      // Handle async render functions with error boundary
      if (result && typeof result.catch === 'function') {
        result.catch(e => {
          console.error(`Page "${page}" render error:`, e);
          content.innerHTML = `<div class="empty-state">
            <i data-lucide="alert-circle"></i>
            <h3>Something went wrong</h3>
            <p style="max-width:400px;margin:0 auto;">${e.message || 'An unexpected error occurred while loading this page.'}</p>
            <button class="btn btn-primary" style="margin-top:16px;" onclick="navigateTo('${page}')">
              <i data-lucide="refresh-cw" style="width:14px;height:14px;"></i> Retry
            </button>
          </div>`;
          if (window.lucide) lucide.createIcons();
        });
      }
    } catch(e) {
      console.error(`Page "${page}" render error:`, e);
      content.innerHTML = `<div class="empty-state">
        <i data-lucide="alert-circle"></i>
        <h3>Something went wrong</h3>
        <p style="max-width:400px;margin:0 auto;">${e.message || 'An unexpected error occurred.'}</p>
        <button class="btn btn-primary" style="margin-top:16px;" onclick="navigateTo('${page}')">
          <i data-lucide="refresh-cw" style="width:14px;height:14px;"></i> Retry
        </button>
      </div>`;
      if (window.lucide) lucide.createIcons();
    }
  }
  window.location.hash = page;
}

window.addEventListener('hashchange', () => {
  const page = window.location.hash.slice(1) || 'dashboard';
  if (routes[page]) navigateTo(page);
});
