import { useEffect, useState } from "react";
import { mockApi } from "../utils/mockAPI";
import { useProductContext } from "./useProductContext";
import { storage } from "../utils/storage";

export function useProduct() {
    const { products, dispatch } = useProductContext();

    const [pagination, setPagination] = useState(() => {
        const page = storage.getCurrentPage();
        const totalPages = storage.getTotalPages();
        return {
            page: isNaN(page) || page < 1 ? 1 : page,
            limit: 10,
            totalPages: isNaN(totalPages) || totalPages < 1 ? 0 : totalPages,
        };
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Search mode: fetch by name
                if (searchTerm.trim() !== "") {
                    const response =
                        await mockApi.findProductsByName(searchTerm);
                    if (isMounted) {
                        dispatch({
                            type: "SET_PRODUCTS",
                            payload: response.data || [],
                        });
                        setPagination((prev) => ({
                            ...prev,
                            totalPages: response.totalPages,
                        }));
                    }
                    return;
                }

                // Normal mode: fetch with pagination
                const response = await mockApi.fetchProducts(
                    pagination.page,
                    pagination.limit,
                );

                if (isMounted) {
                    dispatch({
                        type: "SET_PRODUCTS",
                        payload: response.data || [],
                    });
                    setPagination((prev) => ({
                        ...prev,
                        totalPages: response.totalPages,
                    }));
                    storage.setTotalPages(response.totalPages);
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to fetch products",
                    );
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, [dispatch, pagination.page, pagination.limit, searchTerm]);

    const handlePageChange = (page: number) => {
        storage.setCurrentPage(page);
        setPagination((prev) => ({ ...prev, page }));
    };

    const handleSearch = (searchKey: string) => {
        setSearchTerm(searchKey);
        setPagination((prev) => {
            if (prev.page === 1) return prev;
            storage.setCurrentPage(1);
            return { ...prev, page: 1 };
        });
    };

    const onDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product?"))
            return;
        const response = await mockApi.deleteProduct(id);
        if (response.success) {
            alert("Product deleted successfully!");
            dispatch({ type: "DELETE_PRODUCT", payload: { id } });
            if (products.length === 1 && pagination.page > 1) {
                handlePageChange(pagination.page - 1);
            }
        }
    };

    return {
        products,
        loading,
        error,
        pagination,
        handlePageChange,
        handleSearch,
        onDelete,
    };
}
