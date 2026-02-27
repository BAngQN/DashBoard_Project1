import React from "react";
import { ProductContext } from "../context/ProductContextDefinition";

export function useProductContext() {
    const context = React.useContext(ProductContext);
    if (!context) {
        throw new Error(
            "useProductContext must be used within a ProductProvider",
        );
    }
    return context;
}
