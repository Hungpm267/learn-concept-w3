// src/api/authApi.ts

// Định nghĩa kiểu dữ liệu User (Bạn có thể mở rộng sau)
export interface User {
  id: string;
  username: string;
  email: string;
}

// Định nghĩa kiểu dữ liệu cho hàm login API
type LoginCredentials = {
  username: string;
  password?: string; // Tạm thời password không dùng
};

/**
 * Giả lập API login
 * Chờ 500ms, sau đó trả về thông tin User và một token giả
 */
export const loginApi = (
  credentials: LoginCredentials
): Promise<{ user: User; token: string }> => {
  console.log("API: Đang gọi login cho:", credentials.username);
  return new Promise((resolve) => {
    setTimeout(() => {
      const fakeUser: User = {
        id: "user-123",
        username: credentials.username,
        email: `${credentials.username}@hdwebsoft.dev`,
      };
      const fakeToken = `fake-jwt-token-${Date.now()}`;

      resolve({ user: fakeUser, token: fakeToken });
    }, 500);
  });
};

/**
 * Giả lập API logout
 * Chờ 300ms
 */
export const logoutApi = (): Promise<void> => {
  console.log("API: Đang gọi logout");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
};
