// src/pages/CheckoutForm.tsx

import { useForm, type SubmitHandler } from "react-hook-form";
import { useCartStore } from "@/store/useCartStore";

// 1. Định nghĩa kiểu dữ liệu cho các ô input trong form
type FormInputs = {
  hoTen: string;
  email: string;
  diaChi: string;
};

export function CheckoutForm() {
  // 2. Lấy dữ liệu (cartItems) và hành động (clearCart) từ Zustand
  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);

  // 3. Tính tổng tiền (dùng .reduce() là một kỹ thuật JS nâng cao)
  const totalPrice = cartItems.reduce((total, item) => {
    // Dùng optional chaining `?.` để tránh lỗi
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

  // 4. Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Hàm để reset lại form sau khi submit
  } = useForm<FormInputs>();

  // 5. Hàm này sẽ chạy KHI DỮ LIỆU FORM HỢP LỆ
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log("--- DỮ LIỆU FORM ---");
    console.log(data); // Dữ liệu người dùng nhập (họ tên, email, địa chỉ)
    console.log("--- SẢN PHẨM ĐÃ MUA ---");
    console.log(cartItems); // Các sản phẩm trong giỏ hàng
    console.log("--- TỔNG TIỀN ---");
    console.log(totalPrice);

    // Xử lý logic nghiệp vụ (ví dụ: gọi API gửi đơn hàng...)
    alert(
      `Cảm ơn ${data.hoTen} đã mua hàng!\nTổng tiền: ${totalPrice.toLocaleString(
        "vi-VN"
      )} VNĐ`
    );

    // 6. Xóa giỏ hàng và reset form
    clearCart();
    reset();
  };

  // 7. Render JSX
  return (
    <div className="flex flex-col items-center p-8 border-t-2 mt-8">
      <h1 className="font-bold text-4xl m-8 text-green-500">
        Form Thanh Toán
      </h1>
      <h2 className="text-2xl font-bold mb-4">
        Tổng tiền: {totalPrice.toLocaleString("vi-VN")} VNĐ
      </h2>

      {/* Thông báo nếu giỏ hàng rỗng */}
      {cartItems.length === 0 && (
        <p className="text-gray-500">
          Giỏ hàng của bạn đang rỗng. Vui lòng thêm sản phẩm trước khi thanh
          toán.
        </p>
      )}

      {/* handleSubmit sẽ gọi hàm onSubmit CHỈ KHI form hợp lệ */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 w-full max-w-md"
      >
        {/* --- Ô HỌ TÊN --- */}
        <div>
          <label htmlFor="hoTen" className="block font-medium">
            Họ và Tên
          </label>
          <input
            id="hoTen"
            className="border p-2 rounded w-full"
            placeholder="Nguyễn Văn A"
            // Đăng ký ô input với React Hook Form
            // { required: true } là luật validate: BẮT BUỘC nhập
            {...register("hoTen", { required: true })}
          />
          {/* Hiển thị lỗi nếu trường 'hoTen' không hợp lệ */}
          {errors.hoTen && (
            <span className="text-red-500 text-sm">
              Vui lòng nhập họ và tên.
            </span>
          )}
        </div>

        {/* --- Ô EMAIL --- */}
        <div>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <input
            id="email"
            className="border p-2 rounded w-full"
            placeholder="email@example.com"
            {...register("email", {
              required: "Vui lòng nhập email.", // Ghi rõ thông báo lỗi
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email không đúng định dạng.", // Lỗi nếu sai pattern
              },
            })}
          />
          {/* errors.email?.message sẽ hiển thị thông báo lỗi cụ thể */}
          {errors.email && (
            <span className="text-red-500 text-sm">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* --- Ô ĐỊA CHỈ --- */}
        <div>
          <label htmlFor="diaChi" className="block font-medium">
            Địa chỉ
          </label>
          <input
            id="diaChi"
            className="border p-2 rounded w-full"
            {...register("diaChi", { required: true })}
          />
          {errors.diaChi && (
            <span className="text-red-500 text-sm">
              Vui lòng nhập địa chỉ.
            </span>
          )}
        </div>

        <button
          type="submit"
          // Vô hiệu hóa nút nếu giỏ hàng rỗng
          disabled={cartItems.length === 0}
          className="bg-green-500 text-white p-3 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          Thanh Toán
        </button>
      </form>
    </div>
  );
}