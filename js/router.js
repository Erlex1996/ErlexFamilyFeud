const APP_VERSION = "v0.0.3";
console.log("Erlex Family Feud", APP_VERSION);

function getBasePath() {
  const baseUrl = new URL(document.baseURI);
  const basePath = baseUrl.pathname.replace(/\/$/, "");
  return basePath;
}

function toRelativePath(fullPath, basePath) {
  if (basePath && fullPath.startsWith(basePath)) {
    const relative = fullPath.slice(basePath.length) || "/";
    return relative.startsWith("/") ? relative : "/" + relative;
  }
  return fullPath || "/";
}

function toFullPath(routePath, basePath) {
  return basePath ? basePath + routePath : routePath;
}

function renderRoute() {
  const basePath = getBasePath();
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const relativePath = toRelativePath(path, basePath);
  const target = relativePath === "/" ? "/menu" : relativePath;
  const routes = Array.from(document.querySelectorAll("[data-route]"));
  const hasRoute = routes.some((section) => section.dataset.route === target);
  const finalTarget = hasRoute ? target : "/menu";

  routes.forEach((section) => {
    section.classList.toggle("active", section.dataset.route === finalTarget);
  });

  document.body.classList.toggle("route-menu", finalTarget === "/menu");
  document.body.classList.toggle("route-game", finalTarget === "/game");

  const fullTarget = toFullPath(finalTarget, basePath);
  if (path !== fullTarget) {
    history.replaceState({}, "", fullTarget);
  }

  if (
    finalTarget === "/game" &&
    typeof window.refreshGameFromStorage === "function"
  ) {
    window.refreshGameFromStorage();
  }

  window.scrollTo(0, 0);
}

function appNavigate(path) {
  const basePath = getBasePath();
  const fullPath = toFullPath(path, basePath);
  history.pushState({}, "", fullPath);
  renderRoute();
}

window.appNavigate = appNavigate;
window.addEventListener("popstate", renderRoute);
window.addEventListener("DOMContentLoaded", renderRoute);
