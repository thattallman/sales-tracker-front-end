import React, { useState, useEffect } from "react";

const SalesFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    productName: "",
    quantity: 1,
    dateOfSale: new Date().toISOString().split("T")[0],
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        productName: initialData.productName || "",
        quantity: initialData.quantity || 1,
        dateOfSale: initialData.dateOfSale
          ? new Date(initialData.dateOfSale).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        customerName: initialData.customerName || "",
        customerEmail: initialData.customerEmail || "",
        customerPhone: initialData.customerPhone || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6 shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Sale" : "New Sale"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="productName"
            value={form.productName}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            min={1}
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="date"
            name="dateOfSale"
            value={form.dateOfSale}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
          <input
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            placeholder="Customer Name"
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="email"
            name="customerEmail"
            value={form.customerEmail}
            onChange={handleChange}
            placeholder="Customer Email"
            className="border px-3 py-2 rounded"
          />
          <input
            name="customerPhone"
            value={form.customerPhone}
            onChange={handleChange}
            placeholder="Customer Phone"
            className="border px-3 py-2 rounded"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesFormModal;
