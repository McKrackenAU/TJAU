let adminToken: string | null = "temporary_admin_access_enabled";

export const adminState = {
  setAdminToken: (token: string) => {
    adminToken = token;
  },
  clearAdminToken: () => {
    adminToken = null;
  },
  isAdmin: () => Boolean(adminToken),
  getAdminToken: () => adminToken,
};