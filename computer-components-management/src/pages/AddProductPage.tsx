import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { mockApi } from "../utils/mockAPI";
import type { NewProduct } from "../types/Product";
import { useProductContext } from "../hooks/useProductContext";

function AddProductPage() {
    const { dispatch } = useProductContext();
    const navigate = useNavigate();

    const handleAddProduct = async (data: NewProduct) => {
        try {
            const response = await mockApi.createProduct(data);
            if (response.success && response.data) {
                dispatch({ type: "CREATE_PRODUCT", payload: response.data });
                alert("Product added successfully!");
                navigate("/");
            } else {
                alert("Failed to add product. Please try again.");
            }
        } catch (err) {
            console.error("Error creating product:", err);
            alert("Failed to add product. Please try again.");
        }
    };

    return (
        <div className="app-container">
            <button
                className="btn-back"
                onClick={() => navigate("/")}
                style={{ margin: "20px 0" }}
            >
                ← Back to List
            </button>
            <ProductForm onSubmit={handleAddProduct} />
        </div>
    );
}

export default AddProductPage;
