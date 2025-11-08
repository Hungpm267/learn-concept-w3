// src/pages/TodosTable.tsx

import { useQuery } from "@tanstack/react-query";
import type { Todo } from "@/interfaces/types";
import { fetchTodos } from "@/api/api";

// 1. IMPORT CÁC THÀNH PHẦN CỦA TANSTACK TABLE
import {
  // Hook chính
  useReactTable,
  
  // Các hàm tiện ích
  getCoreRowModel,
  flexRender,
  
  // Các kiểu (Types)
  type ColumnDef, 
} from "@tanstack/react-table";

// 2. ĐỊNH NGHĨA CÁC CỘT (COLUMNS)
// Đây là bước quan trọng nhất.
// Nó nói cho TanStack Table biết:
// - Dữ liệu của bạn có kiểu `Todo`.
// - Bạn muốn hiển thị những cột nào.
const columnstr: string[] = ["pham hung", "anw comw"];
console.log("gia tri mang la: ", columnstr);
const columns: ColumnDef<Todo>[] = [
  {
    accessorKey: "id", // Lấy key 'id' từ data `Todo`
    header: "ID",     // Tiêu đề của cột
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "title",
    header: "Tiêu đề", // Tên cột bạn muốn hiển thị
  },
  {
    accessorKey: "completed",
    header: "Trạng thái",
    
    // Bạn có thể tùy chỉnh nội dung ô (cell)
    cell: (info) => {
      const isCompleted = info.getValue() as boolean;
      return isCompleted ? "✅ Hoàn thành" : "⏳ Chờ";
    },
  },
];

// 3. TẠO COMPONENT
function TodosTable() {
  
  // Bước A: Lấy dữ liệu (Giống hệt TanStackQuery.tsx)
  const { isPending, error, data } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  // Bước B: Khởi tạo Table bằng hook `useReactTable`
  const table = useReactTable({
    // `data ?? []` để xử lý trường hợp data đang undefined
    data: data ?? [], 
    columns: columns, // Cấu hình cột bạn vừa định nghĩa
    getCoreRowModel: getCoreRowModel(), // Hàm này bắt buộc để lấy logic cốt lõi
  });

  // Xử lý trạng thái loading/error
  if (isPending) return "Đang Loading...";
  if (error) return "An error has occurred: " + error.message;

  // Bước C: Render ra HTML
  // Đây là phần "headless" - bạn tự viết JSX
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '2em', marginBottom: '10px' }}>Bảng Todos (TanStack Table)</h1>
      
      {/* Thêm class của Tailwind để có đường viền */}
      <table className="border-collapse border border-slate-400 w-full text-left">
        <thead className="bg-slate-100">
          {/* Lấy các nhóm header (thường chỉ có 1) */}
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              
              {/* Lấy từng header trong nhóm */}
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border border-slate-300 p-2">
                  {/* flexRender sẽ render nội dung của header */}
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {/* Lấy model của các hàng */}
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50">
              
              {/* Lấy từng ô trong hàng */}
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-slate-300 p-2">
                  {/* flexRender sẽ render nội dung của ô (cell) */}
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TodosTable;