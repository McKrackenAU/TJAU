// Simple admin authentication middleware
export function requireAdmin(req: any, res: any, next: any) {
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken) {
    console.error("ADMIN_TOKEN environment variable not set");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const authHeader = req.headers.authorization;

  console.log("Checking admin authentication...");

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("Auth failed: Invalid authorization header format");
    return res.status(403).json({ 
      error: "Unauthorized: Admin access required",
      details: "Please provide a valid admin token"
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

  console.log("Admin authentication successful");
  next();
}