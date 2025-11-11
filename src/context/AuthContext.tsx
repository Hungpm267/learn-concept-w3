// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useMemo,
} from "react";
import { type User, loginApi, logoutApi } from "@/api/authApi";

// 1. Định nghĩa kiểu dữ liệu cho Context
// [cite: 100, 101, 107, 108]
type AuthContextType = {
  user: User | null; // Thông tin user
  token: string | null; // Authentication token
  isLoading: boolean; // Trạng thái chờ (cho login/logout)
  login: (username: string) => Promise<void>; // Hàm login
  logout: () => Promise<void>; // Hàm logout
};


// 2. Tạo Context
// [cite: 112]
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Tạo Provider Component
// [cite: 96]
type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  // 4. Quản lý state nội bộ
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 5. Định nghĩa các hàm (methods)
  // [cite: 114] Hỗ trợ flow bất đồng bộ
  const login = async (username: string) => {
    setIsLoading(true);
    try {
      // Gọi API (chúng ta truyền API vào đây, theo yêu cầu [cite: 97])
      const { user: apiUser, token: apiToken } = await loginApi({ username });

      setUser(apiUser);
      setToken(apiToken);

      // (Nâng cao) Bạn có thể lưu token vào localStorage ở đây
      // [cite: 115]
      // localStorage.setItem("authToken", apiToken);
    } catch (error) {
      console.error("Login failed:", error);
      // (Bạn có thể set state lỗi ở đây nếu muốn)
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutApi();
      setUser(null);
      setToken(null);

      // (Nâng cao) Xóa token khỏi localStorage
      // [cite: 115]
      // localStorage.removeItem("authToken");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Cung cấp giá trị (value) cho Context
  // Dùng useMemo để tối ưu, tránh re-render không cần thiết
  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading] // Dependencies của useMemo
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 7. Tạo Custom Hook (useAuth)
//
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
