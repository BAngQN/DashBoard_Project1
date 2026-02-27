import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Search from "../components/Search";
import ProductList from "../components/ProductList";
import { useProduct } from "../hooks/useProduct";

function HomePage() {
    const navigate = useNavigate();
    const {
        products,
        loading,
        error,
        pagination,
        handlePageChange,
        handleSearch,
        onDelete,
    } = useProduct();

    const handleProductClick = (id: string) => {
        navigate(`/products/${id}`);
    };

    const handleAddProduct = () => {
        navigate("/products/new");
    };

    return (
        <div className="app-container">
            <div className="home-header">
                <Search
                    onSearch={handleSearch}
                    placeholder="Search products by name..."
                />
                <button
                    disabled={loading}
                    className="btn-add-product"
                    onClick={handleAddProduct}
                >
                    + Add New Product
                </button>
            </div>
            <ProductList
                products={products}
                loading={loading}
                error={error}
                onProductClick={handleProductClick}
                currentPage={pagination.page}
                limit={pagination.limit}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                onDelete={onDelete}
            ></ProductList>
        </div>
    );
}

export default HomePage;
