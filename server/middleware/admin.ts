// Simple admin authentication middleware
export function requireAdmin(req: any, res: any, next: any) {
  const adminToken = process.env.ADMIN_TOKEN;
  
  if (!adminToken) {
    console.error("ADMIN_TOKEN environment variable not set");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== adminToken) {
    return res.status(403).json({ error: "Unauthorized: Admin access required" });
  }

  next();
}
