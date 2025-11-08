// src/App.tsx

import TanStackQuery from "./pages/TanStackQuery";
import ReactCTL from "./pages/reactHookFormController";

// 1. Import 2 component Zustand mới
import { BearController } from "./pages/BearController";
import { BearDisplay } from "./pages/BearDisplay";
import TodosTable from "./pages/TodosTable";
import TodosSuperTable from "./pages/TodosSuperTable";

function App() {
  return (
    <div>
      <h1>--- BÀI HỌC TanStack Table ---</h1>
      <TodosSuperTable/>
      
      <p>=========================================================</p>
      <h1>--- BÀI HỌC TanStack Table ---</h1>
      <TodosTable/>

      <p>=========================================================</p>
      <h1>--- BÀI HỌC ZUSTAND ---</h1>
      <BearController />
      <BearDisplay />
      
      <p>=========================================================</p>

      {/* Các component cũ của bạn */}
      <TanStackQuery />
      <p>=========================================================</p>
      <ReactCTL />
    </div>
  );
}

export default App;