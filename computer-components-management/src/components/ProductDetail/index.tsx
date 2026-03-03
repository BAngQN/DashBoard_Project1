import "./index.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockApi } from "../../utils/mockAPI";
import type { Product, NewProduct } from "../../types/Product";
import ProductForm from "../ProductForm";
import { useProductContext } from "../../hooks/useProductContext";
import { toNewProduct } from "../../utils/productMappers";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
});

function ProductDetail() {
    const { dispatch } = useProductContext();
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchProductDetails = async () => {
            if (!id) {
                setError("Product ID is missing");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await mockApi.fetchProductById(id);

                if (isMounted) {
                    if (response.success && response.data) {
                        setProduct(response.data);
                    } else {
                        setError("Failed to fetch product details");
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "An error occurred",
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProductDetails();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleFormSubmit = async (data: NewProduct) => {
        if (!id) return;

        try {
            const response = await mockApi.updateProduct(id, data);
            if (response.success) {
                if (!response.data) {
                    alert("Product not found. It may have been deleted.");
                    navigate("/");
                    return;
                }
                const updatedProduct = response.data as Product;
                setShowForm(false);
                setProduct(updatedProduct);
                dispatch({
                    type: "UPDATE_PRODUCT",
                    payload: updatedProduct,
                });
                alert("Product updated successfully!");
            } else {
                alert("Failed to update product");
            }
        } catch {
            alert("An error occurred while updating the product");
        }
    };

    const handleShowForm = () => {
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
    };

    const handleBackToList = () => {
        navigate("/");
    };

    // Loading state
    if (loading) {
        return (
            <div className="loader-container">
                <div className="app-loader"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="product-detail-container">
                <button className="btn-back" onClick={handleBackToList}>
                    ← Back to List
                </button>
                <p className="product--error">{error}</p>
            </div>
        );
    }

    // Product not found
    if (!product) {
        return (
            <div className="product-detail-container">
                <button className="btn-back" onClick={handleBackToList}>
                    ← Back to List
                </button>
                <h2>Product Not Found</h2>
            </div>
        );
    }

    // Show edit form
    if (showForm) {
        return (
            <div className="product-detail-container">
                <button className="btn-back" onClick={handleCancelForm}>
                    ← Cancel
                </button>
                <ProductForm
                    previousData={toNewProduct(product)}
                    onSubmit={handleFormSubmit}
                />
            </div>
        );
    }

    // Show product details
    return (
        <section className="product app-container">
            <figure className="product__img">
                <img src={product.imgUrl} alt={product.name} />
            </figure>
            <section className="product__detail">
                <h1 className="product__name">{product.name}</h1>
                <p className="product__brand">Brand: {product.brand}</p>
                <p className="product__description">{product.description}</p>
                <div className="product-detail__meta">
                    <div className="meta-item">
                        <span className="meta-item__label">Category:</span>
                        <span className="meta-item__value">
                            {product.category}
                        </span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-item__label">Quantity:</span>
                        <span className="meta-item__value">
                            {product.quantity}
                        </span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-item__label">Price:</span>
                        <span className="meta-item__value">
                            {currencyFormatter.format(product.price)}
                        </span>
                    </div>
                </div>

                <div className="product-detail__actions">
                    <button className="btn-modify" onClick={handleShowForm}>
                        Modify Product
                    </button>
                    <button className="btn-back" onClick={handleBackToList}>
                        Back to List
                    </button>
                </div>

                {product.specifications && (
                    <div className="product-detail__spec">
                        <h2>Specifications</h2>
                        <ul className="spec-list">
                            {Object.entries(product.specifications).map(
                                ([key, value]) => (
                                    <li key={key} className="spec-list__item">
                                        <strong>{key}:</strong> {value}
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>
                )}
                <div className="product-detail__dates">
                    <p>
                        <small>Created: {product.createdAt}</small>
                    </p>
                    <p>
                        <small>Last updated: {product.updatedAt}</small>
                    </p>
                </div>
            </section>
        </section>
    );
}

export default ProductDetail;
