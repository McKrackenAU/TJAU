let adminToken: string | null = import.meta.env.VITE_ADMIN_TOKEN || null;

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