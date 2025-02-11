// Simple admin authentication middleware
export function requireAdmin(req: any, res: any, next: any) {
  // During development/testing, accept our temporary token
  const temporaryAdminToken = "temporary_admin_access_enabled";
  const adminToken = process.env.ADMIN_TOKEN || temporaryAdminToken;

  if (!adminToken) {
    console.error("ADMIN_TOKEN environment variable not set");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const authHeader = req.headers.authorization;

  console.log("Auth header received:", authHeader);
  console.log("Expected token:", adminToken);

  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== adminToken) {
    console.log("Auth failed. Token mismatch or missing.");
    return res.status(403).json({ error: "Unauthorized: Admin access required" });
  }

  next();
}