document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    
    // Apply only if the URL ends with .html
    if (path.endsWith(".html")) {
      const cleanUrl = path.replace(".html", "");
      window.history.pushState({}, "", cleanUrl);
    }
  });
  