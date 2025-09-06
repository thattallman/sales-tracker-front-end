import React, { useEffect, useState } from "react";
import { getAllSales } from "../../../api/sales/sales";
import { useSelector } from "react-redux";
import { selectToken } from "../../../../stores/slices/authSlice";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

const AllSales = () => {
  const token = useSelector(selectToken);
  const [salesData, setSalesData] = useState([]);
  const [productWiseData, setProductWiseData] = useState([]);
  const [dateWiseData, setDateWiseData] = useState([]);
  const [repWiseData, setRepWiseData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await getAllSales(token);
      setSalesData(response);

      const productMap = {};
      response.forEach((sale) => {
        productMap[sale.productName] =
          (productMap[sale.productName] || 0) + sale.quantity;
      });
      setProductWiseData(
        Object.entries(productMap).map(([product, quantity]) => ({
          product,
          quantity,
        }))
      );

      const dateMap = {};
      response.forEach((sale) => {
        const date = new Date(sale.dateOfSale).toLocaleDateString();
        dateMap[date] = (dateMap[date] || 0) + sale.quantity;
      });
      setDateWiseData(
        Object.entries(dateMap).map(([date, quantity]) => ({ date, quantity }))
      );

      const repMap = {};
      response.forEach((sale) => {
        const repName = sale.createdBy?.name || "Unknown";
        repMap[repName] = (repMap[repName] || 0) + sale.quantity;
      });
      setRepWiseData(
        Object.entries(repMap).map(([rep, quantity]) => ({ rep, quantity }))
      );
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchSales();
  }, [token]);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen w-full box-border">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">🧾 All Sales</h1>

      {loading ? (
        <p className="text-gray-700 text-lg">Loading sales data...</p>
      ) : salesData.length === 0 ? (
        <p className="text-center text-lg font-medium text-gray-800 bg-white py-10 rounded-lg shadow">
          🚫 No sales data available.
        </p>
      ) : (
        <>
          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6 mb-10">
            {/* Product-wise */}
            <div className="bg-white shadow rounded-lg p-4 w-full overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4">Product-wise Sales</h2>
              {productWiseData.length === 0 ? (
                <p className="text-center text-gray-600 py-10">
                  📦 No product-wise sales data available.
                </p>
              ) : (
                <div className="w-full" style={{ minWidth: 300 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={productWiseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="product" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="quantity" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Sales Over Time */}
            <div className="bg-white shadow rounded-lg p-4 w-full overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4">Sales Over Time</h2>
              {dateWiseData.length === 0 ? (
                <p className="text-center text-gray-600 py-10">
                  ⏳ No sales data over time available.
                </p>
              ) : (
                <div className="w-full" style={{ minWidth: 300 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dateWiseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="quantity"
                        stroke="#10b981"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Representative-wise */}
            <div className="bg-white shadow rounded-lg p-4 w-full overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4">
                Representative-wise Sales
              </h2>
              {repWiseData.length === 0 ? (
                <p className="text-center text-gray-600 py-10">
                  🧑‍💼 No representative-wise sales data available.
                </p>
              ) : (
                <div className="w-full" style={{ minWidth: 300 }}>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={repWiseData}
                        dataKey="quantity"
                        nameKey="rep"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label
                      >
                        {repWiseData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="w-full min-w-[600px] border border-gray-200 text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-3 py-2 border">Date</th>
                  <th className="px-3 py-2 border">Product</th>
                  <th className="px-3 py-2 border">Quantity</th>
                  <th className="px-3 py-2 border">Customer</th>
                  <th className="px-3 py-2 border">Email</th>
                  <th className="px-3 py-2 border">Phone</th>
                  <th className="px-3 py-2 border">Representative</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border">
                      {new Date(sale.dateOfSale).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 border">{sale.productName}</td>
                    <td className="px-3 py-2 border">{sale.quantity}</td>
                    <td className="px-3 py-2 border">{sale.customerName}</td>
                    <td className="px-3 py-2 border">{sale.customerEmail}</td>
                    <td className="px-3 py-2 border">{sale.customerPhone}</td>
                    <td className="px-3 py-2 border">
                      {sale.createdBy?.name || "Unknown"}
                      <br />
                      <span className="text-xs text-gray-500">
                        {sale.createdBy?.email}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AllSales;
