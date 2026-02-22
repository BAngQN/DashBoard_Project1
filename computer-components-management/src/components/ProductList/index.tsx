import "./index.css";
import type { Product } from "../../types/Product";
import { mockApi } from "../../utils/mockAPI";
import { useContext, type ReactNode } from "react";
import { ProductContext } from "../../context/ProductContextDefinition";
import Search from "../Search";

interface ProductListProps {
    products: Product[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onProductClick?: (id: string) => void;
    onSearch?: (term: string) => void;
    children?: ReactNode;
}

function ProductList({
    products,
    loading = false,
    error = null,
    currentPage,
    totalPages,
    onPageChange,
    onProductClick,
    onSearch,
    children,
}: ProductListProps) {
    const { dispatch } = useContext(ProductContext);
    const currentPageIndex = currentPage - 3 > 0 ? currentPage - 3 : 0;

    const onDelete = async (id: string) => {
        const response = await mockApi.deleteProduct(id);
        if (response.success) {
            alert("Product deleted successfully!");
            dispatch({
                type: "DELETE_PRODUCT",
                payload: { id },
            });
            if (products.length === 1 && currentPage > 1) {
                onPageChange(currentPage - 1);
            }
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="loader"></div>
            </div>
        );
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="products container">
            <div className="products-header">
                <Search
                    onSearch={onSearch}
                    placeholder="Search products by name..."
                />
                {children}
            </div>
            <div className="product__table">
                <div className="product__header">
                    <div className="product__header-item">Order</div>
                    <div className="product__header-item">Name</div>
                    <div className="product__header-item">Quantity</div>
                    <div className="product__header-item">Created</div>
                    <div className="product__header-item">Updated</div>
                    <div className="product__header-item">Action</div>
                </div>
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className="product__row"
                        onClick={() =>
                            onProductClick && onProductClick(product.id)
                        }
                    >
                        <div className="product__cell">{index + 1}</div>
                        <div className="product__cell">{product.name}</div>
                        <div className="product__cell">{product.quantity}</div>
                        <div className="product__cell">{product.createdAt}</div>
                        <div className="product__cell">{product.updatedAt}</div>
                        <div className="product__cell">
                            <button
                                className="product__cta-delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(product.id);
                                }}
                            >
                                ✘ DELETE
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button
                    className="pagination__btn"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    ← Previous
                </button>

                <div className="pagination__info">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(currentPageIndex, currentPageIndex + 5)
                        .map((page) => (
                            <button
                                key={page}
                                className={`pagination__page ${page === currentPage ? "pagination__page--active" : ""}`}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </button>
                        ))}
                </div>

                <button
                    className="pagination__btn"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next →
                </button>
            </div>
        </div>
    );
}

export default ProductList;
