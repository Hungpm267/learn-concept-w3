// api.ts
import type { Todo, NewTodo, Products, Carts } from "../interfaces/types";

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

/**
 * Hàm gọi API để tạo một Todo mới.
 * @param newTodo - Object chứa title của todo mới
 * @returns Promise trả về đối tượng Todo đã được tạo
 */
export const createTodo = async (newTodo: NewTodo): Promise<Todo> => {
  const API_ENDPOINT = 'https://jsonplaceholder.typicode.com/todos';

  const response = await fetch(API_ENDPOINT, {
    method: 'POST', // Chỉ định phương thức là POST
    headers: {
      // Báo cho server biết chúng ta gửi dữ liệu dạng JSON
      'Content-type': 'application/json; charset=UTF-8',
    },
    // Chuyển object JavaScript thành một chuỗi JSON
    body: JSON.stringify({
      title: newTodo.title,
      userId: 1, // API giả của JSONPlaceholder cần userId
      completed: false, // Giá trị mặc định khi tạo mới
    }),
  });

  // Kiểm tra xem API có trả về lỗi không (ví dụ: lỗi 500, 404)
  if (!response.ok) {
    throw new Error('Không thể tạo todo. Vui lòng thử lại.');
  }

  // Chuyển đổi phản hồi (response) từ JSON thành object JavaScript và trả về
  return response.json();
};


// Kiểu dữ liệu cho phần cập nhật, 
// Partial<Todo> nghĩa là "một phần" của Todo, 
// ví dụ: { title: 'Tên mới' } hoặc { completed: true }
export type UpdateTodoPayload = Partial<Omit<Todo, 'id'>>;

/**
 * Hàm gọi API để cập nhật một Todo.
 * @param todoId - ID của todo cần cập nhật
 * @param updates - Dữ liệu cần cập nhật (ví dụ: { title: '...', completed: ... })
 * @returns Promise trả về đối tượng Todo đã được cập nhật
 */
export const updateTodo = async (
  todoId: number, 
  updates: UpdateTodoPayload
): Promise<Todo> => {
  const API_ENDPOINT = `https://jsonplaceholder.typicode.com/todos/${todoId}`;

  const response = await fetch(API_ENDPOINT, {
    method: 'PATCH', // Dùng PATCH để cập nhật một phần
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(updates), // Gửi chỉ những trường thay đổi
  });

  if (!response.ok) {
    throw new Error('Không thể cập nhật todo.');
  }

  return response.json();
};


export const fetchProducts = async(): Promise<Products[]> => {
  const response = await fetch("http://localhost:3000/products");
  return response.json();
} 
export const fetchCart = async(): Promise<Carts[]> => {
  const response = await fetch("http://localhost:3000/cart?_expand=product")
  return response.json();
}