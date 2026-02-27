import { Route, Routes } from "react-router-dom";
import ProductProvider from "./context/ProductProvider";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));
const AddProductPage = lazy(() => import("./pages/AddProductPage"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function AppRoutes() {
    return (
        <ProductProvider>
            <Suspense fallback={<div className="app-loader" />}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products/new" element={<AddProductPage />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </ProductProvider>
    );
}

export default AppRoutes;
