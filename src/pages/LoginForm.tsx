// src/pages/LoginForm.tsx
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "@/context/AuthContext"; // 1. Import hook của chúng ta

// 2. Định nghĩa kiểu dữ liệu cho form
type FormInputs = {
  username: string;
  password: string;
};

export function LoginForm() {
  // 3. Lấy hàm login và trạng thái isLoading từ context
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  // 4. Hàm onSubmit sẽ gọi hàm 'login' từ context
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      // Gọi hàm login từ context với username và password
      await login(data.username, data.password);
      // Bạn không cần làm gì ở đây cả, vì AuthProvider
      // sẽ tự động cập nhật state và component App sẽ re-render
    } catch (err) {
      // (Nâng cao) Nếu hàm login của bạn ném ra lỗi (ví dụ: sai pass)
      // bạn có thể bắt lỗi đó ở đây
      console.error("Login thất bại:", err);
      alert("Đăng nhập thất bại!");
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-2xl font-bold mb-4">Đăng nhập</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-3"
      >
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="border p-2 rounded w-full"
            placeholder="Nhập username"
            // (Giả lập: gõ 'admin' hoặc gì đó)
            {...register("username", { required: "Vui lòng nhập username" })}
          />
          {errors.username && (
            <span className="text-red-500 text-sm">
              {errors.username.message}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="border p-2 rounded w-full"
            placeholder="Nhập password"
            // (Giả lập: gõ '123456')
            {...register("password", { required: "Vui lòng nhập password" })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading} // 5. Vô hiệu hóa nút khi đang loading
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
