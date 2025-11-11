
import TodosSuperTable from "./pages/TodosSuperTable";
import TodosTable from "./pages/TodosTable";
import { BearController } from "./pages/BearController";
import { BearDisplay } from "./pages/BearDisplay";
import TanStackQuery from "./pages/TanStackQuery";
import ReactCTL from "./pages/reactHookFormController";
// src/App.tsx
import { Toaster } from "@/components/ui/sonner";
import { DashBoard } from "./pages/DashBoard";
import { Cart } from "./pages/Cart";
import { CheckoutForm } from "./pages/CheckoutForm";

// 1. Import hook useAuth và component LoginForm
import { useAuth } from "./context/AuthContext";
import { LoginForm } from "./pages/LoginForm";

function App() {
  // 2. Lấy user và hàm logout từ context
  const { user, logout } = useAuth();

  // 3. Render có điều kiện (Conditional Rendering)
  if (!user) {
    // Nếu chưa đăng nhập, chỉ hiển thị form login
    return (
      <div className="flex flex-col items-center p-8">
        <Toaster position="top-center" />
        <LoginForm />
      </div>
    );
  }

  // 4. Nếu đã đăng nhập (user tồn tại)
  // Hiển thị nội dung chính của ứng dụng
  return (
    <div className="flex flex-col items-center">
      <Toaster position="top-center" />

      {/* --- PHẦN XÁC THỰC --- */}
      <div className="w-full max-w-4xl p-4 bg-gray-100 rounded-md mb-8">
        <h1 className="text-xl">
          Chào mừng, <strong>{user.username}</strong>!
        </h1>
        <button
          onClick={logout} // Gọi hàm logout từ context
          className="mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-700"
        >
          Đăng xuất
        </button>
      </div>
      {/* --------------------- */}

      <h1>--- BÀI HỌC DASHBOARD ---</h1>
      <p>=========================================================</p>
      <DashBoard />
      <p>=========================================================</p>
      <Cart />
      <p>=========================================================</p>
      <CheckoutForm />
      <p>=========================================================</p>
      <h1>--- TodosSuperTable ---</h1>
      <TodosSuperTable />
      <p>=========================================================</p>

      <h1>--- BÀI HỌC TanStack Table - TodosTable ---</h1>
      <TodosTable />

      <p>=========================================================</p>
      <h1>--- BÀI HỌC ZUSTAND ---</h1>
      <BearController />
      <BearDisplay />

      <p>=========================================================</p>

      <TanStackQuery />
      <p>=========================================================</p>
      <ReactCTL />

    </div>
  );
}

export default App;
