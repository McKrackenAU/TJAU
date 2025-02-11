let adminToken: string | null = null;

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
