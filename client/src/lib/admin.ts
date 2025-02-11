let adminToken: string | null = null;

export const adminState = {
  setAdminToken: (token: string) => {
    console.log("Setting admin token");
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
    console.log("Getting admin token status:", Boolean(adminToken));
    return adminToken;
  },
  requestAdminToken: async () => {
    const token = prompt("Please enter the admin token:");
    if (token) {
      adminToken = token;
      return true;
    }
    return false;
  }
};