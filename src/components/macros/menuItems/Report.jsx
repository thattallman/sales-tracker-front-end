import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../../../../stores/slices/authSlice";
import { getAllSales } from "../../../api/sales/sales";
import { useReactToPrint } from "react-to-print";
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
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
];

const Report = () => {
  const token = useSelector(selectToken);
  const [salesData, setSalesData] = useState([]);
  const [productWiseData, setProductWiseData] = useState([]);
  const [dateWiseData, setDateWiseData] = useState([]);
  const [customerWiseData, setCustomerWiseData] = useState([]);
  const [repWiseData, setRepWiseData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [salesMetrics, setSalesMetrics] = useState({});
  const [repPerformance, setRepPerformance] = useState([]);
  const reportRef = useRef();
  // ✅ Updated for react-to-print v3+ with custom margins
  const handlePrint = useReactToPrint({
    contentRef: reportRef, // ⬅️ Printable area
    documentTitle: `Sales_Report_${new Date().toLocaleDateString()}`,
    onAfterPrint: () => console.log("✅ Report printed successfully!"),

    // ✅ Custom margins for PDF only
    pageStyle: `
    @page {
      size: A4;
      margin: 5mm 5mm; /* Top/Bottom: 30mm, Left/Right: 20mm */
    }
    @media print {
      body {
        margin: 0 !important;
        padding: 0 !important;
      }
      .no-print {
        display: none !important; /* Hide buttons in PDF */
      }
    }
  `,
  });

  const fetchSales = async () => {
    try {
      const response = await getAllSales(token);
      setSalesData(response);

      // Calculate basic metrics
      const totalSales = response.reduce((sum, sale) => sum + sale.quantity, 0);
      const totalCustomers = new Set(response.map((sale) => sale.customerName))
        .size;
      const totalProducts = new Set(response.map((sale) => sale.productName))
        .size;
      const totalReps = new Set(response.map((sale) => sale.createdBy?.name))
        .size;
      const avgSaleSize = totalSales / response.length;

      setSalesMetrics({
        totalSales,
        totalCustomers,
        totalProducts,
        totalReps,
        avgSaleSize,
        totalTransactions: response.length,
      });

      // 📦 Product-wise Sales
      const productMap = {};
      response.forEach((sale) => {
        productMap[sale.productName] = {
          quantity:
            (productMap[sale.productName]?.quantity || 0) + sale.quantity,
          transactions: (productMap[sale.productName]?.transactions || 0) + 1,
          avgQuantity: 0,
        };
      });

      const productData = Object.entries(productMap).map(([product, data]) => ({
        product,
        quantity: data.quantity,
        transactions: data.transactions,
        avgQuantity: Number((data.quantity / data.transactions).toFixed(2)),
      }));
      setProductWiseData(productData);

      // 📅 Date-wise Sales (Daily)
      const dateMap = {};
      response.forEach((sale) => {
        const date = new Date(sale.dateOfSale).toLocaleDateString();
        dateMap[date] = {
          quantity: (dateMap[date]?.quantity || 0) + sale.quantity,
          transactions: (dateMap[date]?.transactions || 0) + 1,
        };
      });
      const dateData = Object.entries(dateMap)
        .map(([date, data]) => ({
          date,
          quantity: data.quantity,
          transactions: data.transactions,
          avgPerTransaction: Number(
            (data.quantity / data.transactions).toFixed(2)
          ),
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      setDateWiseData(dateData);

      // 📅 Monthly Sales Trend
      const monthMap = {};
      response.forEach((sale) => {
        const month = new Date(sale.dateOfSale).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });
        monthMap[month] = {
          quantity: (monthMap[month]?.quantity || 0) + sale.quantity,
          transactions: (monthMap[month]?.transactions || 0) + 1,
          customers: new Set([
            ...(monthMap[month]?.customers || []),
            sale.customerName,
          ]),
        };
      });
      const monthlyTrend = Object.entries(monthMap).map(([month, data]) => ({
        month,
        quantity: data.quantity,
        transactions: data.transactions,
        uniqueCustomers: data.customers.size,
        avgPerTransaction: Number(
          (data.quantity / data.transactions).toFixed(2)
        ),
      }));
      setMonthlyData(monthlyTrend);

      // 👤 Customer Analysis
      const customerMap = {};
      response.forEach((sale) => {
        if (!customerMap[sale.customerName]) {
          customerMap[sale.customerName] = {
            quantity: 0,
            transactions: 0,
            email: sale.customerEmail,
            phone: sale.customerPhone,
            products: new Set(),
          };
        }
        customerMap[sale.customerName].quantity += sale.quantity;
        customerMap[sale.customerName].transactions += 1;
        customerMap[sale.customerName].products.add(sale.productName);
      });

      const customerData = Object.entries(customerMap)
        .map(([customer, data]) => ({
          customer,
          quantity: data.quantity,
          transactions: data.transactions,
          email: data.email,
          phone: data.phone,
          avgQuantity: Number((data.quantity / data.transactions).toFixed(2)),
          productVariety: data.products.size,
        }))
        .sort((a, b) => b.quantity - a.quantity);

      setCustomerWiseData(customerData.slice(0, 10)); // Top 10 customers

      // 🧑‍💼 Representative Performance
      const repMap = {};
      response.forEach((sale) => {
        const repName = sale.createdBy?.name || "Unknown";
        const repEmail = sale.createdBy?.email || "";
        if (!repMap[repName]) {
          repMap[repName] = {
            quantity: 0,
            transactions: 0,
            customers: new Set(),
            email: repEmail,
            products: new Set(),
          };
        }
        repMap[repName].quantity += sale.quantity;
        repMap[repName].transactions += 1;
        repMap[repName].customers.add(sale.customerName);
        repMap[repName].products.add(sale.productName);
      });

      const repData = Object.entries(repMap).map(([rep, data]) => ({
        rep,
        quantity: data.quantity,
        transactions: data.transactions,
        email: data.email,
        uniqueCustomers: data.customers.size,
        productVariety: data.products.size,
        avgPerTransaction: Number(
          (data.quantity / data.transactions).toFixed(2)
        ),
        customerReach: data.customers.size,
        efficiency: Number((data.quantity / data.transactions).toFixed(2)),
      }));
      setRepWiseData(repData);
      setRepPerformance(repData.sort((a, b) => b.quantity - a.quantity));
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  useEffect(() => {
    if (token) fetchSales();
  }, [token]);

  // Dynamic conclusions based on data
  const generateConclusions = () => {
    const conclusions = [];

    if (productWiseData.length > 0) {
      const topProduct = productWiseData.reduce((prev, curr) =>
        prev.quantity > curr.quantity ? prev : curr
      );
      const leastProduct = productWiseData.reduce((prev, curr) =>
        prev.quantity < curr.quantity ? prev : curr
      );
      conclusions.push(
        `${topProduct.product} is our best-performing product with ${topProduct.quantity} units sold across ${topProduct.transactions} transactions (avg: ${topProduct.avgQuantity} per transaction), while ${leastProduct.product} shows the lowest sales with only ${leastProduct.quantity} units.`
      );
    }

    if (customerWiseData.length > 0) {
      const topCustomer = customerWiseData[0];
      const avgCustomerPurchase =
        salesMetrics.totalSales / salesMetrics.totalCustomers;
      conclusions.push(
        `Our top customer ${topCustomer.customer} has purchased ${
          topCustomer.quantity
        } units across ${
          topCustomer.transactions
        } transactions with an average of ${
          topCustomer.avgQuantity
        } units per purchase, which is ${(
          (topCustomer.avgQuantity / avgCustomerPurchase) *
          100
        ).toFixed(1)}% above the customer average.`
      );
    }

    if (repWiseData.length > 0) {
      const topRep = repWiseData.reduce((prev, curr) =>
        prev.quantity > curr.quantity ? prev : curr
      );
      const mostEfficient = repWiseData.reduce((prev, curr) =>
        prev.avgPerTransaction > curr.avgPerTransaction ? prev : curr
      );
      conclusions.push(
        `${topRep.rep} leads in total sales volume with ${topRep.quantity} units sold to ${topRep.uniqueCustomers} unique customers. ${mostEfficient.rep} shows the highest efficiency with ${mostEfficient.avgPerTransaction} units per transaction average.`
      );
    }

    if (monthlyData.length > 1) {
      const latestMonth = monthlyData[monthlyData.length - 1];
      const prevMonth = monthlyData[monthlyData.length - 2];
      const growth = (
        ((latestMonth.quantity - prevMonth.quantity) / prevMonth.quantity) *
        100
      ).toFixed(1);
      conclusions.push(
        `Sales trend shows ${growth > 0 ? "growth" : "decline"} of ${Math.abs(
          growth
        )}% from ${prevMonth.month} (${prevMonth.quantity} units) to ${
          latestMonth.month
        } (${latestMonth.quantity} units).`
      );
    }

    if (dateWiseData.length > 0) {
      const bestDay = dateWiseData.reduce((prev, curr) =>
        prev.quantity > curr.quantity ? prev : curr
      );
      conclusions.push(
        `Peak daily performance was on ${bestDay.date} with ${bestDay.quantity} units sold across ${bestDay.transactions} transactions.`
      );
    }

    return conclusions;
  };

  return (
    <>
      {/* 🔹 Download Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handlePrint}
          className={`px-5 py-2 rounded-lg cursor-pointer shadow transition ${
            salesData && salesData.length > 0
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
          disabled={!salesData || salesData.length === 0} // ✅ Disable if no data
        >
          ⬇️ Download Report (PDF)
        </button>
      </div>

      {!salesData || salesData.length === 0 ? (
        // ❌ No Data View
        <div className="text-center py-32">
          <h1 className="text-4xl font-bold mb-4">
            📭 No Sales Data Available
          </h1>
          <p className="text-gray-600 text-lg">
            Currently, there are no sales records to display. Once sales are
            recorded, this report will be automatically populated with charts,
            tables, and insights.
          </p>
        </div>
      ) : (
        <div
          ref={reportRef}
          className="p-10 bg-white text-gray-900 font-serif min-h-screen"
        >
          {/* Cover Page */}
          <div className="mb-10 text-center border-b pb-6">
            <h1 className="text-4xl font-bold mb-2">
              📑 Comprehensive Sales Report
            </h1>
            <p className="text-lg text-gray-600">
              Generated on {new Date().toLocaleDateString()} | Total Records:{" "}
              {salesData.length}
            </p>

            {/* Key Metrics Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {salesMetrics.totalSales}
                </div>
                <div className="text-blue-800">Total Units</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {salesMetrics.totalTransactions}
                </div>
                <div className="text-green-800">Transactions</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {salesMetrics.totalCustomers}
                </div>
                <div className="text-purple-800">Customers</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {salesMetrics.totalProducts}
                </div>
                <div className="text-orange-800">Products</div>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  {salesMetrics.totalReps}
                </div>
                <div className="text-indigo-800">Sales Reps</div>
              </div>
              <div className="bg-teal-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-teal-600">
                  {salesMetrics.avgSaleSize?.toFixed(1)}
                </div>
                <div className="text-teal-800">Avg/Sale</div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-3">Executive Summary</h2>
            <p className="text-gray-700 leading-relaxed">
              This comprehensive sales analysis covers {salesData.length}{" "}
              transactions across {salesMetrics.totalProducts} products,
              {salesMetrics.totalCustomers} customers, and{" "}
              {salesMetrics.totalReps} sales representatives. The report
              includes performance metrics, trend analysis, customer
              segmentation, and actionable insights for strategic
              decision-making.
            </p>
          </div>

          {/* Charts Section */}
          <div className="space-y-10 mb-10">
            {/* Monthly Sales Trend */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                📈 Monthly Sales Trend & Performance
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="quantity"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    stroke="#3b82f6"
                  />
                  <Bar yAxisId="left" dataKey="transactions" fill="#10b981" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="uniqueCustomers"
                    stroke="#ef4444"
                    strokeWidth={3}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Product Performance Comparison */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                📦 Product Performance Analysis
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={productWiseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="quantity" fill="#3b82f6" />
                  <Bar yAxisId="left" dataKey="transactions" fill="#10b981" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgQuantity"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Sales Trend */}
            <div
              style={{
                breakInside: "avoid", // ✅ Modern browsers
                pageBreakInside: "avoid", // ✅ Older browsers
              }}
            >
              <h2 className="text-xl font-semibold mb-4">
                📅 Daily Sales Performance
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dateWiseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="quantity"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="transactions"
                    stackId="2"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enhanced Data Tables */}
          <div className="mb-10 space-y-8">
            {/* Customer Analysis Table */}
            <div
              style={{
                breakInside: "avoid", // ✅ Modern browsers
                pageBreakInside: "avoid", // ✅ Older browsers
              }}
            >
              <h2 className="text-xl font-semibold mb-4">
                📊 Customer Performance Analysis
              </h2>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Customer</th>
                      <th className="border px-4 py-2">Total Quantity</th>
                      <th className="border px-4 py-2">Transactions</th>
                      <th className="border px-4 py-2">Avg/Transaction</th>
                      <th className="border px-4 py-2">Product Variety</th>
                      <th className="border px-4 py-2">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerWiseData.slice(0, 10).map((customer, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border px-4 py-2 font-medium">
                          {customer.customer}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {customer.quantity}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {customer.transactions}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {customer.avgQuantity}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {customer.productVariety}
                        </td>
                        <td className="border px-4 py-2 text-xs">
                          {customer.email}
                          <br />
                          {customer.phone}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Representative Performance Table */}
            <div
              style={{
                breakInside: "avoid", // ✅ Modern browsers
                pageBreakInside: "avoid", // ✅ Older browsers
              }}
            >
              <h2 className="text-xl font-semibold mb-4">
                🏆 Sales Representative Leaderboard
              </h2>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Rank</th>
                      <th className="border px-4 py-2 text-left">
                        Representative
                      </th>
                      <th className="border px-4 py-2">Total Sales</th>
                      <th className="border px-4 py-2">Transactions</th>
                      <th className="border px-4 py-2">Unique Customers</th>
                      <th className="border px-4 py-2">Avg/Transaction</th>
                      <th className="border px-4 py-2">Product Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repPerformance.map((rep, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border px-4 py-2 text-center font-bold">
                          #{index + 1}
                        </td>
                        <td className="border px-4 py-2">
                          <div className="font-medium">{rep.rep}</div>
                          <div className="text-xs text-gray-500">
                            {rep.email}
                          </div>
                        </td>
                        <td className="border px-4 py-2 text-center font-semibold">
                          {rep.quantity}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {rep.transactions}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {rep.uniqueCustomers}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {rep.efficiency}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {rep.productVariety}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Dynamic Conclusions */}
          <div
            style={{
              breakInside: "avoid", // ✅ Modern browsers
              pageBreakInside: "avoid", // ✅ Older browsers
            }}
          >
            <h2 className="text-2xl font-bold mb-4">
              🎯 Data-Driven Insights & Conclusions
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-4 text-gray-700 leading-relaxed">
                {generateConclusions().map((conclusion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 font-semibold">
                      {index + 1}
                    </span>
                    <span>{conclusion}</span>
                  </li>
                ))}
              </ul>

              {salesMetrics.totalSales > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    📈 Performance Summary
                  </h3>
                  <p className="text-blue-700">
                    Overall performance shows {salesMetrics.totalSales} units
                    sold across {salesMetrics.totalTransactions} transactions,
                    maintaining an average of{" "}
                    {salesMetrics.avgSaleSize?.toFixed(1)} units per
                    transaction. The sales team successfully engaged{" "}
                    {salesMetrics.totalCustomers} customers with a diverse
                    portfolio of {salesMetrics.totalProducts} products.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Report;
