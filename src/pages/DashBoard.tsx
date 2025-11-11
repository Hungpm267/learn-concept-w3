import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/api/api";
import { type Products } from "@/interfaces/types";
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
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
// import toast, { Toaster } from "react-hot-toast";
import { toast } from "sonner";


// const notify = () =>
//   toast.success("Thêm sản phẩm thành công.");

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
    // accessorKey: "imageUrl",

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

      // const notify = () =>
      //   toast.success(`Thêm sản phẩm ${product.name} thành công.`, { duration: 1000 });

      return (
        <>
          <button
            onClick={() => {
              handleAddClick();
              toast.success(`Thêm sản phẩm ${product.name} thành công.`);
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded"
          >
            Thêm
          </button>
        </>
      );
    },
  },
];
export function DashBoard() {
  const { isPending, error, data } = useQuery<Products[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 7,
  });

  const table = useReactTable({
    data: data ?? [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),

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
    getSortedRowModel: getSortedRowModel(), // Thêm Sắp xếp
    getFilteredRowModel: getFilteredRowModel(), // Thêm Lọc
    getPaginationRowModel: getPaginationRowModel(), // Thêm Phân trang
  });
  if (isPending) return "is Loading...";
  if (error) return "An error occurred " + error.message;

  return (
    <div>
      <h1 className=" font-bold text-4xl m-8 text-rose-500">Products Table</h1>
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Lọc 'Tên SP'..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="border p-2 rounded"
        />
      </div>
      <table className="border p-2 ">
        <thead>
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
                      asc: " (tăng dần🔼)",
                      desc: " (giảm dần🔽)",
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
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
