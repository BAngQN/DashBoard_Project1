import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import { Suspense } from "react";

function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <Suspense fallback={<div className="app-loader" />}>
                    <AppRoutes />
                </Suspense>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;
