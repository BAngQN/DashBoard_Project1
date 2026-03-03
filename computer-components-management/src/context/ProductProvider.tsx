import { useReducer } from "react";
import type { Product } from "../types/Product";
import { ProductContext, type ProductAction } from "./ProductContextDefinition";

function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, dispatch] = useReducer(productReducer, []);
    return (
        <ProductContext.Provider value={{ products, dispatch }}>
            {children}
        </ProductContext.Provider>
    );
}

function productReducer(products: Product[], action: ProductAction) {
    switch (action.type) {
        case "SET_PRODUCTS":
            return action.payload;
        case "CREATE_PRODUCT":
            return [...products, action.payload];
        case "UPDATE_PRODUCT":
            return products.map((product) =>
                product.id === action.payload.id
                    ? { ...product, ...action.payload }
                    : product,
            );
        case "DELETE_PRODUCT":
            return products.filter(
                (product) => product.id !== action.payload.id,
            );
    }
}
export default ProductProvider;
