export type TUser = {
  userId: string;
  name: string;
  email: string;
  role: "user" | "admin";
  hasShop?: boolean;
  isActive?: boolean;
  iat?: number;
  exp?: number;
};
