// Admin authentication middleware
export function requireAdmin(req: any, res: any, next: any) {
  // First check if user is logged in and has admin flag
  if (req.isAuthenticated() && req.user && req.user.isAdmin) {
    console.log("Admin authentication successful via user session");
    return next();
  }
  
  // Fallback to token-based admin authentication for API calls
  const adminToken = "g6vDAE^YiQT8Uoi!c@XmvoYdhsqGn*xw"; // Hard-coded for safety

  const authHeader = req.headers.authorization;
  console.log("Checking admin token authentication...");

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("Auth failed: Invalid authorization header format");
    return res.status(403).json({ 
      error: "Unauthorized: Admin access required",
      details: "Please login as admin or provide a valid admin token"
    });
  }

  const providedToken = authHeader.split(' ')[1];
  if (providedToken !== adminToken) {
    console.log("Auth failed: Invalid token provided");
    return res.status(403).json({ 
      error: "Unauthorized: Admin access required",
      details: "Invalid admin token"
    });
  }

  console.log("Admin authentication successful via token");
  next();
}