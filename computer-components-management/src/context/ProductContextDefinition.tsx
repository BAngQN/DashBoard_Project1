import { createContext } from "react";
import type { Product } from "../types/Product";

export type ProductAction =
    | { type: "SET_PRODUCTS"; payload: Product[] }
    | { type: "CREATE_PRODUCT"; payload: Product }
    | { type: "UPDATE_PRODUCT"; payload: Product }
    | { type: "DELETE_PRODUCT"; payload: { id: string } };

interface ProductContextType {
    products: Product[];
    dispatch: React.Dispatch<ProductAction>;
}

export const ProductContext = createContext<ProductContextType | null>(null);
