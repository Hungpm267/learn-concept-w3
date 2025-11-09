// src/App.tsx

import TanStackQuery from "./pages/TanStackQuery";
import ReactCTL from "./pages/reactHookFormController";

// 1. Import 2 component Zustand mới
import { BearController } from "./pages/BearController";
import { BearDisplay } from "./pages/BearDisplay";
import TodosTable from "./pages/TodosTable";
import { DashBoard } from "./pages/DashBoard";
import TodosSuperTable from "./pages/TodosSuperTable";
import { Cart } from "./pages/Cart";
import { CheckoutForm } from "./pages/CheckoutForm";

function App() {
  return (
    <div className=" flex flex-col items-center">
      <h1>--- BÀI HỌC DASHBOARD ---</h1>
      <p>=========================================================</p>
      <DashBoard />
      <p>=========================================================</p>
      <Cart/>
      <p>=========================================================</p>
      <CheckoutForm /> {/* <-- THÊM DÒNG NÀY */}
      <p>=========================================================</p>
      <TodosSuperTable />
      <p>=========================================================</p>

      {/* <h1>--- BÀI HỌC TanStack Table ---</h1>
      <TodosSuperTable />

      <p>=========================================================</p>
      <h1>--- BÀI HỌC TanStack Table ---</h1>
      <TodosTable />

      <p>=========================================================</p>
      <h1>--- BÀI HỌC ZUSTAND ---</h1>
      <BearController />
      <BearDisplay />

      <p>=========================================================</p>

      <TanStackQuery />
      <p>=========================================================</p>
      <ReactCTL /> */}
    </div>
  );
}

export default App;
