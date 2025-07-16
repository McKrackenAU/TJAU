import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Hide loading screen and show app
function hideLoadingScreen() {
  // For mobile, keep fallback visible until React fully loads
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const delay = isMobile ? 1000 : 100; // Longer delay for mobile
  
  setTimeout(() => {
    document.body.classList.add('app-loaded');
    
    // Remove loading screen after transition
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.remove();
      }
      
      // Only hide fallback if React is actually working
      const rootContent = document.querySelector('#root > div');
      const fallback = document.getElementById('fallback-content');
      
      if (rootContent && fallback) {
        // React content exists, hide fallback
        fallback.style.display = 'none';
      } else if (fallback) {
        // No React content, keep fallback visible
        console.log('React failed to load, keeping fallback visible');
      }
    }, 800); // Longer transition for mobile
  }, delay);
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

// Enhanced error handling for mobile
try {
  // Render app and hide loading screen
  root.render(<App />);
  
  // Hide loading screen after initial render
  hideLoadingScreen();
} catch (error) {
  console.error('React render failed:', error);
  
  // Force show fallback content if React fails
  const fallback = document.getElementById('fallback-content');
  if (fallback) {
    fallback.style.display = 'block';
    fallback.style.position = 'fixed';
    fallback.style.top = '0';
    fallback.style.left = '0';
    fallback.style.width = '100vw';
    fallback.style.height = '100vh';
    fallback.style.zIndex = '10000';
  }
  
  // Hide loading screen
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.remove();
  }
}
