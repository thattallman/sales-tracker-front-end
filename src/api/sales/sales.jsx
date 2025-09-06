import { api } from "../services";


export const getAllSales = async (token) => {
  try {
    const res = await api.get("/sales", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching sales data", error);
    throw error;
  }
};

export const createSale = async (saleData, token) => {
  try {
    const res = await api.post("/sales", saleData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating sale", error);
    throw error;
  }
};

export const updateSale = async (id, saleData, token) => {
  try {
    const res = await api.put(`/sales/${id}`, saleData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating sale", error);
    throw error;
  }
};
export const deleteSale = async (id, token) => {
  try {
    const res = await api.delete(`/sales/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting sale", error);
    throw error;
  }
};