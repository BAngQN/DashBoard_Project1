import "./index.css";
import type { Product } from "../../types/Product";
import { type ReactNode } from "react";
import PaginationComponent from "../Pagination";

interface ProductListProps {
    products: Product[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    limit: number;
    onPageChange: (page: number) => void;
    onProductClick?: (id: string) => void;
    onDelete?: (id: string) => void;
    children?: ReactNode;
}

function ProductList({
    products,
    loading = false,
    error = null,
    currentPage,
    totalPages,
    limit,
    onPageChange,
    onProductClick,
    onDelete,
    children,
}: ProductListProps) {
    if (loading) {
        return (
            <div className="loading">
                <div className="app-loader"></div>
            </div>
        );
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="products app-container">
            <div className="products-header">{children}</div>
            <div
                className="product__table"
                role="grid"
                aria-label="Products table"
                aria-rowcount={products.length + 1}
                aria-colcount={6}
            >
                <div className="product__header" role="row">
                    <div className="product__header-item" role="columnheader">
                        Order
                    </div>
                    <div className="product__header-item" role="columnheader">
                        Name
                    </div>
                    <div className="product__header-item" role="columnheader">
                        Quantity
                    </div>
                    <div className="product__header-item" role="columnheader">
                        Created
                    </div>
                    <div className="product__header-item" role="columnheader">
                        Updated
                    </div>
                    <div className="product__header-item" role="columnheader">
                        Action
                    </div>
                </div>
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className="product__row"
                        role="row"
                        onClick={() =>
                            onProductClick && onProductClick(product.id)
                        }
                    >
                        <div className="product__cell" role="gridcell">
                            {limit * (currentPage - 1) + index + 1}
                        </div>
                        <div className="product__cell" role="gridcell">
                            {product.name}
                        </div>
                        <div className="product__cell" role="gridcell">
                            {product.quantity}
                        </div>
                        <div className="product__cell" role="gridcell">
                            {product.createdAt}
                        </div>
                        <div className="product__cell" role="gridcell">
                            {product.updatedAt}
                        </div>
                        <div className="product__cell" role="gridcell">
                            {onDelete && (
                                <button
                                    className="product__cta-delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete?.(product.id);
                                    }}
                                >
                                    ✘ DELETE
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
}

export default ProductList;
