// src/pages/BearController.tsx
import { useBearStore } from '@/store/useBearStore'; // Dùng alias '@' mà bạn đã cấu hình

// Component này sẽ đọc state VÀ dùng actions
export function BearController() {
  // Lấy state từ store bằng "selector"
  // Component này sẽ chỉ re-render khi state `bears` thay đổi
  const bears = useBearStore((state) => state.bears);

  // Lấy actions từ store
  const increase = useBearStore((state) => state.increaseBear);
  const decrease = useBearStore((state) => state.decreaseBear);


  return (
    <div style={{ border: '1px solid blue', padding: '10px' }}>
      <h2>Số gấu hiện tại: {bears}</h2>
      
      <button 
        style={{ marginRight: '5px', border: '1px solid black' }} 
        onClick={increase}
      >
        Tăng 1 con gấu
      </button>
      <button 
        style={{ border: '1px solid black' }} 
        onClick={decrease}
      >
        Giảm 1 con gấu
      </button>
    </div>
  );
}