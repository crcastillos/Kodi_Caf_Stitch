export const navItems = [
  { path: 'inicio', label: 'Inicio', icon: 'potted_plant' },
  { path: 'mi-finca', label: 'Mi finca', icon: 'map' },
  { path: 'riesgos', label: 'Riesgos', icon: 'warning_amber' },
  { path: 'simular', label: 'Simular', icon: 'tune' },
  { path: 'asistente', label: 'Asistente', icon: 'psychology' },
];

export const defaultRoute = 'inicio';

export function pathToHash(path) {
  return `#/${path}`;
}

export function hashToPath(hash) {
  const raw = (hash || '#/login').replace(/^#\/?/, '');
  return raw || 'login';
}
