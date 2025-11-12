import { type Carts } from "@/interfaces/types";
import { useCartStore } from "@/store/useCartStore";
import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { toast } from "sonner";


// const notify = () => toast.success("Xóa khỏi cart thành công.", {duration:1000});

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
      const imageUrl = row.original.product?.imageUrl;
      const productName = row.original.product?.name;

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
    accessorKey: "product.category",
    header: "product_category",
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const myproduct = row.original;
      // Lấy action 'removeProduct' từ store
      const removeProduct = useCartStore((state) => state.removeProduct);

      const handleDeleteClick = () => {
        console.log("Xóa sản phẩm:", myproduct.product?.name, myproduct.id);
        // Gọi action với ID của cart item (myproduct.id)
        removeProduct(myproduct.id);
      };

      // const notify = () =>
      //   toast.success(`Xóa sản phẩm ${myproduct.product?.name} thành công.`);

      return (
        <>
          <button
            onClick={() => {
              handleDeleteClick();
              toast(`Xóa sản phẩm ${myproduct.product?.name} thành công.`);
            }}
            className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-2 rounded"
          >
            Xóa
          </button>
        </>
      );
    },
  },
];

export function Cart() {
  // BỎ useQuery
  /*
  const { isPending, error, data } = useQuery<Carts[]>({
    queryKey: ["cart"], // (Bạn nên sửa thành ["cart"] như tôi nói ở lần trước)
    queryFn: fetchCart,
  });
  */

  // THAY BẰNG VIỆC ĐỌC TỪ ZUSTAND
  const data = useCartStore((state) => state.cartItems);

  const table = useReactTable({
    data: data ?? [], // data bây giờ là từ Zustand
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Bỏ isPending và error (vì Zustand luôn có data, ít nhất là mảng rỗng)
  // if (isPending) return "is Loading...";
  // if (error) return "An error occurred " + error.message;

  return (
    <div>
      <h1 className=" font-bold text-4xl m-8 text-rose-500">
        Carts Table (Zustand)
      </h1>
      <table className="border p-2 ">
        {/* ... (Phần <thead> và <tbody> giữ nguyên) ... */}
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
