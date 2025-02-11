// This is a temporary development token that matches the server
const TEMP_ADMIN_TOKEN = "temporary_admin_access_enabled";

let adminToken: string | null = TEMP_ADMIN_TOKEN;

export const adminState = {
  setAdminToken: (token: string) => {
    console.log("Setting admin token:", token);
    adminToken = token;
  },
  clearAdminToken: () => {
    console.log("Clearing admin token");
    adminToken = null;
  },
  isAdmin: () => {
    const hasToken = Boolean(adminToken);
    console.log("Checking admin status:", hasToken);
    return hasToken;
  },
  getAdminToken: () => {
    console.log("Getting admin token:", adminToken);
    return adminToken;
  },
};