import { mockData } from "../data/mockData";
import type { NewProduct, Product } from "../types/Product";

const simulateNetworkDelay = (ms?: number | 500) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
    fetchProducts: async (page: number = 1, limit: number = 10) => {
        await simulateNetworkDelay();
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedData = mockData.slice(start, end);
        return {
            data: {
                data: paginatedData,
                page,
                limit,
                totalPages: Math.ceil(mockData.length / limit),
            },
            success: true,
            message: "Products fetched successfully",
        };
    },

    fetchProductById: async (id: string) => {
        await simulateNetworkDelay(1500);
        const product = mockData.find((item) => item.id === id);
        return {
            data: product || null,
            success: !!product,
            message: product
                ? "Product fetched successfully"
                : "Product not found",
        };
    },

    createProduct: async (product: NewProduct) => {
        await simulateNetworkDelay();
        const newProduct: Product = {
            id: `prod${Date.now()}`,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
            ...product,
        };
        mockData.push(newProduct);
        return {
            success: true,
            data: newProduct,
            message: "Product created successfully",
        };
    },

    updateProduct: async (id: string, updatedFields: Partial<NewProduct>) => {
        await simulateNetworkDelay();
        const productIndex = mockData.findIndex((item) => item.id === id);
        if (productIndex === -1) {
            return {
                success: false,
                message: "Product not found",
            };
        }
        const existingProduct = mockData[productIndex];
        const updatedProduct: Product = {
            ...existingProduct,
            ...updatedFields,
            updatedAt: new Date().toISOString().split("T")[0],
        };
        mockData[productIndex] = updatedProduct;
        return {
            success: true,
            data: updatedProduct,
            message: "Product updated successfully",
        };
    },

    deleteProduct: async (id: string) => {
        await simulateNetworkDelay();
        const productIndex = mockData.findIndex((item) => item.id === id);
        if (productIndex === -1) {
            return {
                success: false,
                message: "Product not found",
            };
        }
        mockData.splice(productIndex, 1);
        return {
            success: true,
            message: "Product deleted successfully",
        };
    },

    findProductsByName: async (name: string, limit: number = 10) => {
        await simulateNetworkDelay();
        const matchedProducts = mockData
            .filter((item) => {
                return item.name
                    .toLocaleLowerCase()
                    .includes(name.toLocaleLowerCase().trim());
            })
            .slice(0, limit);
        return {
            data: matchedProducts,
            totalPages: Math.ceil(matchedProducts.length / limit),
            limit: limit,
            success: true,
            message: "Products fetched successfully",
        };
    },
};
