import { mockData } from "../data/mockData";
import type { ApiResponse, PaginatedResponse } from "../types/ApiResponse";
import type { NewProduct, Product, UpdateProductDTO } from "../types/Product";

const simulateNetworkDelay = (ms: number = 500) =>
    new Promise((resolve) => setTimeout(resolve, ms));
const products = [...mockData];

export const mockApi = {
    fetchProducts: async (page: number = 1, limit: number = 10) => {
        await simulateNetworkDelay();
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedData = products.slice(start, end);
        const response: PaginatedResponse<Product> = {
            data: paginatedData,
            totalPages: Math.ceil(products.length / limit),
            currentPage: page,
            limit: limit,
            success: true,
            message: "Products fetched successfully",
        };
        return response;
    },

    fetchProductById: async (id: string) => {
        await simulateNetworkDelay(1500);
        const product = products.find((item) => item.id === id);
        const response: ApiResponse<Product> = {
            data: product,
            success: !!product,
            message: product
                ? "Product fetched successfully"
                : "Product not found",
        };
        return response;
    },

    createProduct: async (product: NewProduct) => {
        await simulateNetworkDelay();
        const newProduct: Product = {
            id: `prod${Date.now()}`,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
            ...product,
        };
        products.push(newProduct);
        const response: ApiResponse<Product> = {
            success: true,
            data: newProduct,
            message: "Product created successfully",
        };
        return response;
    },

    updateProduct: async (id: string, updatedFields: UpdateProductDTO) => {
        await simulateNetworkDelay();
        const productIndex = products.findIndex((item) => item.id === id);
        if (productIndex === -1) {
            return {
                success: false,
                message: "Product not found",
            };
        }
        const existingProduct = products[productIndex];
        const updatedProduct: Product = {
            ...existingProduct,
            ...updatedFields,
            updatedAt: new Date().toISOString().split("T")[0],
        };
        products[productIndex] = updatedProduct;
        const response: ApiResponse<Product> = {
            success: true,
            data: updatedProduct,
            message: "Product updated successfully",
        };
        return response;
    },

    deleteProduct: async (id: string) => {
        await simulateNetworkDelay();
        const productIndex = products.findIndex((item) => item.id === id);
        if (productIndex === -1) {
            return {
                success: false,
                message: "Product not found",
            };
        }
        products.splice(productIndex, 1);
        const response: ApiResponse<Product[]> = {
            success: true,
            data: products,
            message: "Product deleted successfully",
        };
        return response;
    },

    findProductsByName: async (name: string, limit: number = 10) => {
        await simulateNetworkDelay();
        const matchedProducts = products
            .filter((item) => {
                return item.name
                    .toLocaleLowerCase()
                    .includes(name.toLocaleLowerCase().trim());
            })
            .slice(0, limit);
        const response: PaginatedResponse<Product> = {
            data: matchedProducts,
            totalPages: Math.ceil(matchedProducts.length / limit),
            currentPage: 1,
            limit: limit,
            success: true,
            message: "Products fetched successfully",
        };
        return response;
    },
};
