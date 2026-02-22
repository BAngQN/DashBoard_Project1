import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetail from "./components/ProductDetail";
import AddProductPage from "./pages/AddProductPage";
import ProductProvider from "./context/ProductProvider";

function AppRoutes() {
    return (
        <ProductProvider>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products/new" element={<AddProductPage />} />
                <Route path="/products/:id" element={<ProductDetail />} />
            </Routes>
        </ProductProvider>
    );
}

export default AppRoutes;
