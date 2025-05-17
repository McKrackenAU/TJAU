import React, { useEffect } from 'react';

// This component helps manage the course navigation transition
// It's used to handle special cases like the Pendulum course
export function CourseNavigationHelper() {
  useEffect(() => {
    // Check if we're coming from the Pendulum course
    const isPendulumNavigation = sessionStorage.getItem('pendulum-nav');
    
    if (isPendulumNavigation) {
      // Clear the flag
      sessionStorage.removeItem('pendulum-nav');
      
      // Force a reload of the learning page to ensure clean state
      if (window.location.pathname === '/learning') {
        window.location.reload();
      }
    }
  }, []);
  
  // This component doesn't render anything
  return null;
}