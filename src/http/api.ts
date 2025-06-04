import { api } from "./client";
import { DeliveryPerson, Warehouse } from "@/types";

export const getAllProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const createProduct = async (data: FormData) => {
  const response = await api.post("/products", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

interface DeliveryPersonResponse {
  allDeliveryPerson: DeliveryPerson[];
}

export const getAllDeliveryPersons = async () => {
  try {
    const response = await api.get<DeliveryPersonResponse>("/delivery-persons");

    return response.data.allDeliveryPerson;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const createDeliveryPersons = async (data: {
  name: string;
  phone: string;
  warehouseId: number;
}) => {
  const response = await api.post("/delivery-persons", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

interface WarehouseResponse {
  AllWarehouses: Warehouse[];
}

export const getAllWarehouses = async () => {
  try {
    const response = await api.get<WarehouseResponse>("/warehouses");
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const CreateWarehouses = async (data: {
  name: string;
  pincode: string;
}) => {
  const response = await api.post("/warehouses", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};