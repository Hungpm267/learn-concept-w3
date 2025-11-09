import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/api/api";
import { type Products } from "@/interfaces/types";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";

const columns: ColumnDef<Products>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  // SỬA CỘT HÌNH ẢNH ĐỂ HIỂN THỊ ẢNH
  {
    header: "Image",
    // Bạn có thể giữ accessorKey hoặc bỏ đi nếu dùng cell phức tạp
    accessorKey: "imageUrl",

    // Dùng 'cell' để render một thẻ <img>
    cell: ({ row }) => {
      // row.original là data của cả hàng đó (tương ứng 1 item trong Carts[])
      const imageUrl = row.original.imageUrl;
      const productName = row.original.name;

      return (
        <img
          src={imageUrl}
          alt={productName}
          className="w-30 h-16 object-cover rounded" // Thêm class (Tailwind) để giới hạn kích thước
        />
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const product = row.original;

      // 2. LẤY ACTION TỪ STORE
      const addProductToCart = useCartStore((state) => state.addProduct);

      const handleAddClick = () => {
        // 3. GỌI ACTION KHI CLICK
        addProductToCart(product);
        console.log("Đã thêm vào giỏ hàng (Zustand):", product.name);
      };

      return (
        <button
          onClick={handleAddClick}
          className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded"
        >
          Thêm
        </button>
      );
    },
  },
];
export function DashBoard() {
  const { isPending, error, data } = useQuery<Products[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 7,
  });
  const table = useReactTable({
    data: data ?? [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),

    state: {
      pagination: pagination,
    },
    //paging
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(), // Bật logic phân trang
  });

  if (isPending) return "is Loading...";
  if (error) return "An error occurred " + error.message;

  return (
    <div>
      <h1 className=" font-bold text-4xl m-8 text-rose-500">Products Table</h1>
      <table className="border p-2 ">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className="border p-2 " key={header.id}>
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td className="border p-2 " key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* =============================================================== */}

      <div className="flex items-center gap-2 p-4 justify-center">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)} // Về trang đầu
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()} // Trang trước
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()} // Trang sau
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)} // Về trang cuối
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>

        <span className="flex items-center gap-1">
          <div>Trang</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </strong>
        </span>

        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="border p-1 rounded"
        >
          {[7, 14, 21, 28].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Hiển thị {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
