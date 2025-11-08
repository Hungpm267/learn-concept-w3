// src/pages/BearDisplay.tsx
import { useBearStore } from '@/store/useBearStore';

// Component này CHỈ đọc state
export function BearDisplay() {
  // Lấy state `bears`
  const bears = useBearStore((state) => state.bears);

  return (
    <div style={{ border: '1px solid green', padding: '10px', marginTop: '10px' }}>
      <h3>Tôi là component khác, chỉ hiển thị:</h3>
      <p>Số gấu trong kho là: {bears}</p>
    </div>
  );
}