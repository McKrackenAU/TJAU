import React from "react";
import { Link, useLocation } from "wouter";
import "./nav-override.css";

export function SimpleNav() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <div 
      id="tarot-navigation"
      className="sm:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "#000000",
        height: "64px",
        borderTop: "none",
        boxShadow: "none",
        paddingBottom: 0,
        maxHeight: "64px !important"
      }}
    >
      <div 
        style={{
          display: "flex",
          height: "100%",
          maxWidth: "400px",
          margin: "0 auto"
        }}
      >
        <Link 
          href="/" 
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center",
            color: isActive("/") ? "#FFFFFF" : "#9CA3AF"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span style={{ fontSize: "0.75rem", marginTop: "4px" }}>Home</span>
        </Link>
        
        <Link 
          href="/daily" 
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center",
            color: isActive("/daily") ? "#FFFFFF" : "#9CA3AF"
          }}
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
          <span style={{ fontSize: "0.75rem", marginTop: "4px" }}>Daily</span>
        </Link>
        
        <Link 
          href="/spreads" 
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center",
            color: isActive("/spreads") ? "#FFFFFF" : "#9CA3AF"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span style={{ fontSize: "0.75rem", marginTop: "4px" }}>Spreads</span>
        </Link>
        
        <Link 
          href="/library" 
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center",
            color: isActive("/library") ? "#FFFFFF" : "#9CA3AF"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <span style={{ fontSize: "0.75rem", marginTop: "4px" }}>Library</span>
        </Link>
        
        <Link 
          href="/account" 
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center",
            color: isActive("/account") ? "#FFFFFF" : "#9CA3AF"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span style={{ fontSize: "0.75rem", marginTop: "4px" }}>Account</span>
        </Link>
      </div>
    </div>
  );
}