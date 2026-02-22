import { useContext, useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import { mockApi } from "../utils/mockAPI";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContextDefinition";
import "./HomePage.css";

function HomePage() {
    const { products, dispatch } = useContext(ProductContext);
    const navigate = useNavigate();

    const initialPage = () => {
        const saved = localStorage.getItem("currentPage");
        const parsed = saved ? parseInt(saved, 10) : 1;
        return isNaN(parsed) || parsed < 1 ? 1 : parsed;
    };

    const totalPages = () => {
        const savedTotal = localStorage.getItem("totalPages");
        const parsedTotal = savedTotal ? parseInt(savedTotal, 10) : 0;
        return isNaN(parsedTotal) || parsedTotal < 1 ? 0 : parsedTotal;
    };

    const [pagination, setPagination] = useState({
        page: initialPage(),
        limit: 10,
        totalPages: totalPages(),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Reset page to 1 when search term changes
    useEffect(() => {
        setPagination((prev) => ({ ...prev, page: 1 }));
        localStorage.setItem("currentPage", "1");
    }, [searchTerm]);

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
                    console.log("Search response:", response.totalPages);
                    if (isMounted) {
                        dispatch({
                            type: "SET_PRODUCTS",
                            payload: response.data,
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
                    pagination.limit
                );

                // Only update if component is still mounted
                if (isMounted) {
                    dispatch({
                        type: "SET_PRODUCTS",
                        payload: response.data.data,
                    });
                    setPagination((prev) => ({
                        ...prev,
                        totalPages: response.data.totalPages,
                    }));
                    // Persist pagination state
                    localStorage.setItem(
                        "totalPages",
                        response.data.totalPages.toString()
                    );
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to fetch products"
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [dispatch, pagination.page, pagination.limit, searchTerm]);

    const handlePageChange = (page: number) => {
        localStorage.setItem("currentPage", page.toString());
        setPagination((prev) => ({ ...prev, page }));
    };

    const handleProductClick = (id: string) => {
        navigate(`/products/${id}`);
    };

    const handleAddProduct = () => {
        navigate("/products/new");
    };

    const handleSearch = (searchKey: string) => {
        setSearchTerm(searchKey);
    };

    return (
        <div>
            <div className="container">
                <ProductList
                    products={products}
                    loading={loading}
                    error={error}
                    onProductClick={handleProductClick}
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    onSearch={handleSearch}
                >
                    <button
                        className="btn-add-product"
                        onClick={handleAddProduct}
                    >
                        + Add New Product
                    </button>
                </ProductList>
            </div>
        </div>
    );
}

export default HomePage;
