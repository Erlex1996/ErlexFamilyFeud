function renderRoute(){
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const target = path === '/' ? '/menu' : path;
  const routes = Array.from(document.querySelectorAll('[data-route]'));
  const hasRoute = routes.some(section => section.dataset.route === target);
  const finalTarget = hasRoute ? target : '/menu';

  routes.forEach(section => {
    section.classList.toggle('active', section.dataset.route === finalTarget);
  });

  document.body.classList.toggle('route-menu', finalTarget === '/menu');
  document.body.classList.toggle('route-game', finalTarget === '/game');

  if (path !== finalTarget) {
    history.replaceState({}, '', finalTarget);
  }

  if (finalTarget === '/game' && typeof window.refreshGameFromStorage === 'function') {
    window.refreshGameFromStorage();
  }

  window.scrollTo(0, 0);
}

function appNavigate(path){
  history.pushState({}, '', path);
  renderRoute();
}

window.appNavigate = appNavigate;
window.addEventListener('popstate', renderRoute);
window.addEventListener('DOMContentLoaded', renderRoute);
