import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Hide loading screen and show app
function hideLoadingScreen() {
  setTimeout(() => {
    document.body.classList.add('app-loaded');
    // Remove loading screen after transition
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.remove();
      }
    }, 500);
  }, 100); // Small delay to ensure app is ready
}

// Add global error handlers to prevent runtime errors
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Prevent the error from crashing the app
});

window.addEventListener('error', (event) => {
  console.warn('Global error caught:', event.error);
  event.preventDefault(); // Prevent the error from crashing the app
});

const root = createRoot(document.getElementById("root")!);

// Render app and hide loading screen
root.render(<App />);

// Hide loading screen after initial render
hideLoadingScreen();
