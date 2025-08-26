import { useEffect, useState } from "react";

declare global {
  interface Window { cv: any }
}

export function useOpenCVReady() {
  const [ready, setReady] = useState<boolean>(false);
  useEffect(() => {
    let interval: any;
    function check() {
      // OpenCV sets cv and cv.Mat after runtime init
      if (window.cv && typeof window.cv.getBuildInformation === "function") {
        setReady(true);
        clearInterval(interval);
      }
    }
    // If already loaded
    check();
    // If not, attach to onRuntimeInitialized if available
    if (window.cv && !ready) {
      window.cv["onRuntimeInitialized"] = () => {
        setReady(true);
      };
    }
    // Also poll in case script loads after
    interval = setInterval(check, 300);
    return () => clearInterval(interval);
  }, []);
  return ready;
}