import { create } from "zustand";
import { type Carts, type Products } from "@/interfaces/types";

type CartState = {
  cartItems: Carts[];
  addProduct: (product: Products) => void;
  removeProduct: (cartItemId: number) => void;
  clearCart: () => void; // dọn dẹp giỏ hàng sau khi thanh toán thành công
};

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  addProduct: (productToAdd) =>
    set((state) => {
      // 1. Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItem = state.cartItems.find(
        (item) => item.productId === productToAdd.id
      );

      // 2. Nếu đã tồn tại -> Tăng số lượng
      if (existingItem) {
        return {
          cartItems: state.cartItems.map((item) =>
            item.productId === productToAdd.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      // 3. Nếu chưa tồn tại -> Thêm mới vào giỏ hàng
      // (Chúng ta dùng Date.now() để tạo ID tạm ở client)
      const newItem: Carts = {
        id: Date.now(), // ID này chỉ dùng ở client
        productId: productToAdd.id,
        quantity: 1,
        product: productToAdd, // Lưu luôn cả object product (dựa theo type Carts của bạn)
      };

      return {
        cartItems: [...state.cartItems, newItem],
      };
    }),
  // <-- THÊM HÀM NÀY
  // Action: Xóa một item khỏi giỏ hàng
  removeProduct: (cartItemId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== cartItemId),
    })),
  clearCart: () => set({ cartItems: [] }),
}));
