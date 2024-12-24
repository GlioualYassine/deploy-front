import axiosInstance from './lib/axiosInstance';
export const checkAuth = async (token: string): Promise<boolean> => {
  try {
    await axiosInstance.get('auth/check-auth', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (err) {
    return false;
  }
};

export const getUserRole = async (token: string): Promise<string | null> => {
  try {
    const res = await axiosInstance.get('auth/check-auth', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data?.role || null;
  } catch (err) {
    return null;
  }
};

export const adminRoutes = [
  "/utilisateurs",
  "/appareils",
  "/companies",
  "/notifications",
  "/paiement",
  "/tracking",
  "/rapports",
  "/dashboard"
];

export const nonAdminRoutes = [
  "/appareils",
  "/paiement",
  "/rapports",
  "/tracking",
  "/notifications",
  "/dashboard"
];


