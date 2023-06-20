import { getCookie } from "./components/Authentication/helpers";

export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          "/service-worker.js"
        );
        console.log("Service Worker registered:", registration);
        startRefreshTimeout();
      } catch (error) {
        console.log("Service Worker registration failed:", error);
      }
    });
  }
}

function startRefreshTimeout() {
  // Function to refresh the service worker every hour
  async function refreshServiceWorker() {
    try {
      // Perform any necessary tasks inside the service worker
      // For example, you might update caches or perform background synchronization
      // ...
    } catch (error) {
      // Handle any errors that occur during the service worker refresh
      console.error("Failed to refresh service worker:", error);
    } finally {
      // Schedule the next service worker refresh after 1 hour
      setTimeout(refreshServiceWorker, 60 * 60 * 1000); // 1 hour in milliseconds
    }
  }

  // Start the initial service worker refresh
  refreshServiceWorker();
}
