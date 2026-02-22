import "./index.css";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockApi } from "../../utils/mockAPI";
import type { Product, NewProduct } from "../../types/Product";
import ProductForm from "../ProductForm";
import { ProductContext } from "../../context/ProductContextDefinition";

function ProductDetail() {
    const { dispatch } = useContext(ProductContext);
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
                    if (response.success) {
                        setProduct(response.data);
                    } else {
                        setError("Failed to fetch product details");
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err instanceof Error ? err.message : "An error occurred"
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
        } catch (err) {
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
                <div className="loader"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container">
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
            <div className="container">
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
            <div className="container">
                <button className="btn-back" onClick={handleCancelForm}>
                    ← Cancel
                </button>
                <ProductForm
                    previousData={{
                        name: product.name,
                        brand: product.brand,
                        description: product.description,
                        category: product.category,
                        quantity: product.quantity,
                        price: product.price,
                        imgUrl: product.imgUrl,
                        specifications: product.specifications,
                    }}
                    onSubmit={handleFormSubmit}
                />
            </div>
        );
    }

    // Show product details
    return (
        <section className="product container">
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
                            {product.price}
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
                                )
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
