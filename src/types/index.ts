export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}
export interface DeliveryPerson {
  id: number;
  name: string;
  phone: string;
  warehouseId: number;
}

export interface Warehouse {
  id: number;
  name: string;
}
