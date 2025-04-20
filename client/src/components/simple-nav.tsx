import React from "react";
import { Link, useLocation } from "wouter";

export function SimpleNav() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black h-16" style={{ borderTop: "none" }}>
      <div className="flex h-full max-w-md mx-auto">
        <Link 
          href="/" 
          className={`flex-1 flex flex-col items-center justify-center ${isActive("/") ? "text-white" : "text-gray-400"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          href="/daily" 
          className={`flex-1 flex flex-col items-center justify-center ${isActive("/daily") ? "text-white" : "text-gray-400"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
          </svg>
          <span className="text-xs mt-1">Daily</span>
        </Link>
        
        <Link 
          href="/spreads" 
          className={`flex-1 flex flex-col items-center justify-center ${isActive("/spreads") ? "text-white" : "text-gray-400"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span className="text-xs mt-1">Spreads</span>
        </Link>
        
        <Link 
          href="/library" 
          className={`flex-1 flex flex-col items-center justify-center ${isActive("/library") ? "text-white" : "text-gray-400"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <span className="text-xs mt-1">Library</span>
        </Link>
        
        <Link 
          href="/account" 
          className={`flex-1 flex flex-col items-center justify-center ${isActive("/account") ? "text-white" : "text-gray-400"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="text-xs mt-1">Account</span>
        </Link>
      </div>
    </div>
  );
}