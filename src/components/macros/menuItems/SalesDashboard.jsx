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
import { useNavigate } from "react-router-dom";
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

const SalesDashboard = () => {
  const token = useSelector(selectToken);
  const [salesData, setSalesData] = useState([]);
  const [productWiseData, setProductWiseData] = useState([]);
  const [customerWiseData, setCustomerWiseData] = useState([]);
  const [dateWiseData, setDateWiseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  // Fetch sales data
  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await getAllSales(token);
      setSalesData(response);

      // Group data by product for product-wise chart
      const productMap = {};
      response.forEach((sale) => {
        productMap[sale.productName] = (productMap[sale.productName] || 0) + sale.quantity;
      });
      setProductWiseData(
        Object.entries(productMap).map(([product, quantity]) => ({
          product,
          quantity,
        }))
      );

      // Group response by customer for top customers chart
      const customerMap = {};
      response.forEach((sale) => {
        customerMap[sale.customerName] = (customerMap[sale.customerName] || 0) + sale.quantity;
      });
      setCustomerWiseData(
        Object.entries(customerMap)
          .map(([customer, quantity]) => ({
            customer,
            quantity,
          }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5) // Top 5 customers only
      );

      // Group data by date for sales-over-time chart
      const dateMap = {};
      response.forEach((sale) => {
        const date = new Date(sale.dateOfSale).toLocaleDateString();
        dateMap[date] = (dateMap[date] || 0) + sale.quantity;
      });
      setDateWiseData(
        Object.entries(dateMap).map(([date, quantity]) => ({
          date,
          quantity,
        }))
      );
    } catch (error) {
      console.error("Error occurred during fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSale = () => {
    // Replace with your actual navigation logic
    navigate('/dashboard/sales')
  };

  useEffect(() => {
    if (token) fetchSales();
  }, [token]);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">📊 Sales Dashboard</h1>

        {loading ? (
          // Enhanced Loading State
          <div className="flex flex-col items-center justify-center mt-32">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-black"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse h-8 w-8 bg-black rounded-full opacity-20"></div>
              </div>
            </div>
            <p className="text-gray-600 mt-6 text-lg font-medium">Loading sales data...</p>
            <p className="text-gray-400 mt-2 text-sm">Please wait while we fetch your sales information</p>
          </div>
        ) : salesData.length === 0 ? (
          // Enhanced Empty State
          <div className="flex flex-col items-center justify-center mt-20">
            <div className="bg-gray-50 rounded-full p-8 mb-6">
              <svg 
                className="w-24 h-24 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-3">No Sales Yet</h2>
            <p className="text-gray-500 text-lg text-center max-w-md mb-8">
              It looks like you haven't recorded any sales yet. Start adding sales to see insights and analytics here.
            </p>
            
            <button
              onClick={handleAddSale}
              className="bg-black hover:bg-gray-800 cursor-pointer text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              <span className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add First Sale
              </span>
            </button>
            
            <p className="text-gray-400 mt-4 text-sm">Get started by recording your first sale</p>
          </div>
        ) : (
          // Dashboard when data exists
          <div>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Sales</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{salesData.length}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Quantity</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {salesData.reduce((sum, sale) => sum + sale.quantity, 0)}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Products</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{productWiseData.length}</p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product-wise Sales */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Product-wise Sales</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productWiseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="product" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" fill="#000000" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Sales Over Time */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Sales Over Time</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dateWiseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="quantity" 
                      stroke="#000000" 
                      strokeWidth={3}
                      dot={{ fill: '#000000', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Top 5 Customers */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm col-span-1 lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Top 5 Customers</h2>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={customerWiseData}
                      dataKey="quantity"
                      nameKey="customer"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {customerWiseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Action Button for existing data */}
            <div className="mt-8 text-center">
              <button
                onClick={handleAddSale}
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Sale
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesDashboard;