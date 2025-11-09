import { type Carts } from "@/interfaces/types";
import { useQuery } from "@tanstack/react-query";
import { fetchCart } from "@/api/api";
import { useReactTable, type ColumnDef, getCoreRowModel, flexRender } from "@tanstack/react-table";

const columns: ColumnDef<Carts>[] = [
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "product.id",
    header: "product_id",
  },
  {
    accessorKey: "product.name",
    header: "product_name",
  },
  {
    accessorKey: "product.price",
    header: "product_price",
  },
  {
    accessorKey: "product.description",
    header: "product_description",
  },
  // SỬA CỘT HÌNH ẢNH ĐỂ HIỂN THỊ ẢNH
  {
    header: "product_image",
    // Bạn có thể giữ accessorKey hoặc bỏ đi nếu dùng cell phức tạp
    // accessorKey: "product.imageUrl",

    // Dùng 'cell' để render một thẻ <img>
    cell: ({ row }) => {
      // row.original là data của cả hàng đó (tương ứng 1 item trong Carts[])
      const imageUrl = row.original.product.imageUrl;
      const productName = row.original.product.name;

      return (
        <img
          src={imageUrl}
          alt={productName}
          className="w-16 h-16 object-cover rounded" // Thêm class (Tailwind) để giới hạn kích thước
        />
      );
    },
  },
  {
    accessorKey: "product.category",
    header: "product_category",
  },
];

export function Cart() {
  const { isPending, error, data } = useQuery<Carts[]>({
    queryKey: ["products"],
    queryFn: fetchCart,
  });
  const table = useReactTable({
    data: data ?? [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending) return "is Loading...";
  if (error) return "An error occurred " + error.message;
  return (
    <div>
      <h1 className=" font-bold text-4xl m-8 text-rose-500">Carts Table</h1>
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
    </div>
  );
}
