// src/pages/TodosTable.tsx

import React from "react"; // 1. Import React (cho useState)
import { useQuery } from "@tanstack/react-query";
import type { Todo } from "@/interfaces/types";
import { fetchTodos } from "@/api/api";

// 2. IMPORT THÊM CÁC THÀNH PHẦN
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  
  // Sắp xếp (Sorting)
  getSortedRowModel,
  type SortingState,
  
  // Lọc (Filtering)
  getFilteredRowModel,
  type ColumnFiltersState,

  // Phân trang (Pagination)
  getPaginationRowModel,

  type ColumnDef,
} from "@tanstack/react-table";

// 3. ĐỊNH NGHĨA CỘT (Không thay đổi nhiều)
const columns: ColumnDef<Todo>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
    // Cho phép lọc cột này
    enableColumnFilter: true,
  },
  {
    accessorKey: "completed",
    header: "Trạng thái",
    cell: (info) => {
      const isCompleted = info.getValue() as boolean;
      return isCompleted ? "✅ Hoàn thành" : "⏳ Chờ";
    },
    // Cho phép lọc cột này
    enableColumnFilter: true,
  },
];

// --- COMPONENT CHÍNH ---
function TodosSuperTable() {
  
  // Lấy dữ liệu (Giống hệt TanStackQuery.tsx)
  const { isPending, error, data } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  // 4. KHAI BÁO STATE CHO CÁC TÍNH NĂNG
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, // Bắt đầu ở trang đầu tiên
    pageSize: 10,  // Hiển thị 10 hàng mỗi trang
  });

  // 5. NÂNG CẤP `useReactTable`
  const table = useReactTable({
    data: data ?? [], // Dùng `data ?? []` để tránh lỗi khi data là undefined
    columns,
    
    // --- Nối state và handlers ---
    
    // Sắp xếp
    state: {
      sorting: sorting,
      columnFilters: columnFilters,
      pagination: pagination,
    },
    
    // Lọc
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,

    // --- Thêm các "pipeline" (hàm get) ---
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),     // Thêm Sắp xếp
    getFilteredRowModel: getFilteredRowModel(), // Thêm Lọc
    getPaginationRowModel: getPaginationRowModel(), // Thêm Phân trang
  });

  // Xử lý trạng thái loading/error
  if (isPending) return "Đang Loading...";
  if (error) return "An error has occurred: " + error.message;

  // 6. RENDER JSX (NÂNG CẤP UI)
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '2em', marginBottom: '10px' }}>Bảng Todos (Full Tính Năng)</h1>
      
      {/* Thêm các ô Lọc */}
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Lọc 'Tiêu đề'..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('title')?.setFilterValue(e.target.value)
          }
          className="border p-2 rounded"
        />
        <input
          placeholder="Lọc 'Trạng thái' (gõ 'true' hoặc 'false')..."
          value={(table.getColumn('completed')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('completed')?.setFilterValue(e.target.value)
          }
          className="border p-2 rounded"
        />
      </div>

      {/* --- Table --- */}
      <table className="border-collapse border border-slate-400 w-full text-left">
        <thead className="bg-slate-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border border-slate-300 p-2">
                  
                  {/* Thêm sự kiện onClick để Sắp xếp */}
                  <div
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    
                    {/* Hiển thị mũi tên Sắp xếp */}
                    {{
                      'asc': ' 🔼',
                      'desc': ' 🔽',
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {/* Vòng lặp này không cần thay đổi! */}
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-slate-300 p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 7. THÊM BỘ ĐIỀU KHIỂN PHÂN TRANG */}
      <div className="flex items-center gap-2 p-4 justify-center">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)} // Về trang đầu
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()} // Trang trước
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()} // Trang sau
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)} // Về trang cuối
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        
        <span className="flex items-center gap-1">
          <div>Trang</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </strong>
        </span>
        
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
          className="border p-1 rounded"
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Hiển thị {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default TodosSuperTable;