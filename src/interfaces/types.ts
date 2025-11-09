// types.ts
export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

// Kiểu dữ liệu cho một Todo mới (chúng ta chỉ cần gửi title)
export type NewTodo = {
  title: string;
};

export type Products = {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
}

export type Carts = {
  id: number;
  productId: number;
  quantity: number;
  product?: Products;
}