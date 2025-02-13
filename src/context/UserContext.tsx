import { getCurrentUser } from "@/services/auth/auth.service";
import { TUser } from "@/types/user.type";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type TUserContextValues = {
  user: TUser | null;
  loading: boolean;
  setUser: (user: TUser | null) => void;
  setLoading: (loading: boolean) => void;
};

const UserContext = createContext<TUserContextValues | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);

  const handleUser = async () => {
    const user = await getCurrentUser();
    setUser(user);
    setLoading(false);
  };

  useEffect(() => {
    handleUser();
  }, [loading]);

  const value = {
    user,
    loading,
    setUser,
    setLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
};

export default UserProvider;
