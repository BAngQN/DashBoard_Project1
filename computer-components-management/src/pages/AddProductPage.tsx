import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { mockApi } from "../utils/mockAPI";
import type { NewProduct } from "../types/Product";
import { ProductContext } from "../context/ProductContextDefinition";

function AddProductPage() {
    const { dispatch } = useContext(ProductContext);
    const navigate = useNavigate();
    console.log("AddProductPage rendered");

    const handleAddProduct = async (data: NewProduct) => {
        const response = await mockApi.createProduct(data);
        if (response.success) {
            dispatch({ type: "CREATE_PRODUCT", payload: response.data });
            console.log("Product created:", response.data);
            alert("Product added successfully!");
            navigate("/");
        }
    };

    return (
        <div className="container">
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
