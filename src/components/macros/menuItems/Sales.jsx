import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../../../../stores/slices/authSlice";
import {
  getAllSales,
  createSale,
  updateSale,
  deleteSale,
} from "../../../api/sales/sales";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import SalesFormModal from "./SalesFormModal";
import toast from "react-hot-toast";

const Sales = () => {
  const token = useSelector(selectToken);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSale, setEditSale] = useState(null);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await getAllSales(token);
      setSales(response);
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error("Failed to fetch sales data!");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchSales();
  }, [token]);

  const handleAddNew = () => {
    setEditSale(null);
    setModalOpen(true);
  };

  const handleEdit = (sale) => {
    setEditSale(sale);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      try {
        await deleteSale(id, token);
        setSales((prev) => prev.filter((s) => s._id !== id));
        toast.success("Sale deleted successfully!");
      } catch (error) {
        console.error("Error deleting sale:", error);
        toast.error("Failed to delete sale!");
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editSale) {
        const updated = await updateSale(editSale._id, data, token);
        setSales((prev) =>
          prev.map((s) => (s._id === updated.sale._id ? updated.sale : s))
        );
        toast.success("Sale updated successfully!");
      } else {
        const newSale = await createSale(data, token);
        setSales((prev) => [newSale.sale, ...prev]);
        toast.success("Sale created successfully!");
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving sale:", error);
      toast.error("Failed to save sale!");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen w-full box-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Sales Management
        </h1>
        <button
          onClick={handleAddNew}
          className="flex items-center cursor-pointer gap-2 bg-gray-900 text-white px-4 sm:px-5 py-2 rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-300"
        >
          <FaPlus /> Add Sale
        </button>
      </div>

      {/* Loading / Empty State */}
      {loading ? (
        <p className="text-gray-500">Fetching sales data...</p>
      ) : sales.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-600 text-lg">No sales found.</p>
          <button
            onClick={handleAddNew}
            className="mt-4 px-4 py-2 rounded bg-black hover:bg-gray-800 text-white transition-all"
          >
            Add Your First Sale
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-[600px] w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="py-2 px-3 text-left">Product</th>
                <th className="py-2 px-3 text-left">Quantity</th>
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-left">Customer</th>
                <th className="py-2 px-3 text-left">Email</th>
                <th className="py-2 px-3 text-left">Phone</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <tr
                  key={sale._id}
                  className={`transition-all ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50`}
                >
                  <td className="py-2 px-3">{sale.productName}</td>
                  <td className="py-2 px-3">{sale.quantity}</td>
                  <td className="py-2 px-3">
                    {new Date(sale.dateOfSale).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-3">{sale.customerName}</td>
                  <td className="py-2 px-3">
                    {sale.customerEmail || (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {sale.customerPhone || (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(sale)}
                      className="text-yellow-500 hover:text-yellow-600 transition-all"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(sale._id)}
                      className="text-red-500 hover:text-red-600 transition-all"
                      title="Delete"
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <SalesFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editSale}
        />
      )}
    </div>
  );
};

export default Sales;
