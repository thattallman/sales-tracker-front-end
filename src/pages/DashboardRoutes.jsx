import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Sales from "../components/macros/menuItems/Sales";
import Report from "../components/macros/menuItems/Report";
import AllSales from "../components/macros/menuItems/AllSales";
import SalesDashboard from "../components/macros/menuItems/SalesDashboard";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../stores/slices/authSlice";

function DashboardRoutes() {
  const user = useSelector(selectCurrentUser);

  return (
    <Routes>
      {/* Dashboard Layout */}
      <Route path="/dashboard" element={<Dashboard />}>
        {/* Nested Routes */}
        <Route path="sales" element={<Sales />} />
        <Route path="reports" element={<Report />} />

        {/* ✅ Conditional default route */}
        {user?.role === "manager" ? (
          <Route index element={<AllSales />} />
        ) : (
          <Route index element={<SalesDashboard />} />
        )}
      </Route>
    </Routes>
  );
}

export default DashboardRoutes;
