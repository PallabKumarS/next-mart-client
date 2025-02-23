import { getCurrentUser } from "@/services/AuthService";
import { IUser } from "@/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type TUserContextValues = {
  user: IUser | null;
  loading: boolean;
  setUser: (user: IUser | null) => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

const UserContext = createContext<TUserContextValues | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
  return context;
};

export default UserProvider;
