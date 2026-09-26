import { renderSidebar } from '../components/sidebar.js';
import { renderAppHeader } from '../components/app-header.js';
import { bindAnalisisRiesgo, renderAnalisisRiesgo } from './analisis-riesgo.js';
import { renderPlaceholder } from './placeholders.js';
import { logout } from '../auth.js';
import { navItems } from '../config/navigation.js';

export function renderShell(activePath) {
  const navMatch = navItems.find((item) => item.path === activePath);
  const headerSubtitle = navMatch
    ? `CafIA — ${navMatch.label}`
    : 'Monitoreo Agroclimático Cafetalero';

  return `
    ${renderSidebar(activePath)}
    <div class="pl-72 min-h-screen bg-surface">
      ${renderAppHeader(headerSubtitle)}
      <main class="relative pt-16 w-full px-8 pb-12 bg-surface min-h-screen">
        ${activePath === 'riesgos' ? renderAnalisisRiesgo() : renderPlaceholder(activePath)}
      </main>
    </div>
  `;
}

export function bindShell() {
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    logout();
    window.location.hash = '#/login';
  });
  bindAnalisisRiesgo();
}
