## Critical — Bugs & Data Integrity

### 1. Mock data has typo — `image` instead of `imgUrl`

**File:** `src/data/mockData.ts` (line 48)

The `Product` interface defines `imgUrl`, but `mon003` uses `image`. This product renders with a broken image.

```diff
- image: "https://mmd-aoc2.oss-cn-hongkong.aliyuncs.com/...",
+ imgUrl: "https://mmd-aoc2.oss-cn-hongkong.aliyuncs.com/...",
```

---

### 2. Duplicate mock data entry

**File:** `src/data/mockData.ts` (lines 207–223)

`spk0012` is an exact copy of `spk001` (same name, price, description, imgUrl). This is either a copy-paste error or should have different data.

**Fix:** Remove the duplicate entry, or update it with distinct product data.

---

### 3. `mockAPI.ts` mutates the imported `mockData` array directly

**File:** `src/utils/mockAPI.ts` (lines 45, 85)

`createProduct` calls `mockData.push(...)` and `deleteProduct` calls `mockData.splice(...)`. Mutating a shared imported array causes stale data issues and unpredictable behavior across navigations.

```diff
+ let products = [...mockData];
  // Use `products` in all API methods instead of `mockData`
```

---

### 4. Double API fetch on search

**File:** `src/pages/HomePage.tsx` (lines 34–108)

Two `useEffect` hooks both trigger on `searchTerm`. The first resets `page` to 1, the second fetches products depending on both `searchTerm` and `pagination.page`. This causes **two** fetch calls every time the user searches.

**Fix:** Merge the two effects into one. Handle the page-reset logic inside the fetch effect:

```typescript
useEffect(() => {
  let isMounted = true;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      if (searchTerm.trim()) {
        const response = await mockApi.findProductsByName(searchTerm);
        if (isMounted) {
          dispatch({ type: 'SET_PRODUCTS', payload: response.data });
          setPagination((prev) => ({
            ...prev,
            page: 1,
            totalPages: response.totalPages,
          }));
        }
      } else {
        const response = await mockApi.fetchProducts(
          pagination.page,
          pagination.limit,
        );
        if (isMounted) {
          dispatch({
            type: 'SET_PRODUCTS',
            payload: response.data.data,
          });
          setPagination((prev) => ({
            ...prev,
            totalPages: response.data.totalPages,
          }));
          localStorage.setItem(
            'totalPages',
            response.data.totalPages.toString(),
          );
        }
      }
    } catch (err) {
      if (isMounted) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch products',
        );
      }
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchProducts();
  return () => {
    isMounted = false;
  };
}, [dispatch, pagination.page, pagination.limit, searchTerm]);
```

---

### 5. `ProductForm` number inputs return strings instead of numbers

**File:** `src/components/ProductForm/index.tsx` (lines 145–155, 168–176)

`react-hook-form` with `type="number"` inputs still returns **strings** unless `valueAsNumber` is set. Creating a product sets `price: "1490000"` (string) instead of `price: 1490000` (number).

```diff
  {...register("quantity", {
      required: "This input is required.",
+     valueAsNumber: true,
      min: { value: 0, message: "Quantity cannot be negative." },
  })}
```

```diff
  {...register("price", {
      required: "This input is required.",
+     valueAsNumber: true,
      min: { value: 0, message: "Price cannot be negative." },
  })}
```

---

### 6. Missing `key` prop on `<option>` elements

**File:** `src/components/ProductForm/index.tsx` (lines 131–133)

React will warn about missing `key` props in the console.

```diff
  {PRODUCT_TYPES.map((type) => (
-     <option value={type}>{type}</option>
+     <option key={type} value={type}>{type}</option>
  ))}
```

---

## High — React Anti-patterns & Architecture

### 7. `ProductList` is coupled to the API and Context layers

**File:** `src/components/ProductList/index.tsx` (lines 31–46)

`ProductList` receives `products` as props but also reaches into Context and calls the API directly. This breaks the separation between presentational and container components.

**Fix:** Lift the delete handler to `HomePage` and pass it as an `onDelete` prop:

```typescript
// HomePage.tsx
const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
        return;
    const response = await mockApi.deleteProduct(id);
    if (response.success) {
        dispatch({ type: "DELETE_PRODUCT", payload: { id } });
        if (products.length === 1 && pagination.page > 1) {
            handlePageChange(pagination.page - 1);
        }
    }
};

// In JSX:
<ProductList onDelete={handleDelete} /* ...other props */ />;
```

Remove `useContext` and `mockApi` imports from `ProductList`.

---

### 8. No `useMemo` on context value — causes unnecessary re-renders

**File:** `src/context/ProductProvider.tsx` (line 8)

A new object `{ products, dispatch }` is created every render, causing all context consumers to re-render even when nothing changed.

```diff
+ import { useReducer, useMemo } from "react";

  function ProductProvider({ children }: { children: React.ReactNode }) {
      const [products, dispatch] = useReducer(productReducer, []);
+     const contextValue = useMemo(
+         () => ({ products, dispatch }),
+         [products, dispatch]
+     );
      return (
-         <ProductContext.Provider value={{ products, dispatch }}>
+         <ProductContext.Provider value={contextValue}>
              {children}
          </ProductContext.Provider>
      );
  }
```

---

### 9. No custom hook for context access — silent failures

**File:** `src/context/ProductContextDefinition.tsx` (lines 15–18)

The default value with a noop `dispatch` silently swallows dispatched actions if a component is accidentally used outside the Provider.

**Fix:** Create a custom hook with a runtime guard:

```typescript
// src/hooks/useProductContext.ts
import { useContext } from 'react';
import { ProductContext } from '../context/ProductContextDefinition';

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
}
```

Update `ProductContextDefinition.tsx`:

```typescript
export const ProductContext = createContext<ProductContextType | null>(null);
```

Replace all `useContext(ProductContext)` calls across the codebase with `useProductContext()`.

---

### 10. `simulateNetworkDelay` has a broken default parameter

**File:** `src/utils/mockAPI.ts` (line 4)

`number | 500` resolves to just `number` — the literal `500` is redundant. Since `ms` is optional with no default, calling `simulateNetworkDelay()` passes `undefined` to `setTimeout`.

```diff
- const simulateNetworkDelay = (ms?: number | 500) =>
+ const simulateNetworkDelay = (ms: number = 500) =>
      new Promise((resolve) => setTimeout(resolve, ms));
```

---

### 11. No error handling in `AddProductPage.handleAddProduct`

**File:** `src/pages/AddProductPage.tsx` (lines 13–21)

No `try/catch`, no handling of `response.success === false`. If the API throws, it will be an unhandled promise rejection.

```diff
  const handleAddProduct = async (data: NewProduct) => {
+     try {
          const response = await mockApi.createProduct(data);
          if (response.success) {
              dispatch({ type: "CREATE_PRODUCT", payload: response.data });
              navigate("/");
+         } else {
+             // show error to user
          }
+     } catch {
+         // show error to user
+     }
  };
```

---

### 12. No delete confirmation

**File:** `src/components/ProductList/index.tsx` (lines 34–46)

Clicking "DELETE" immediately deletes with no confirmation. Users can accidentally destroy data.

**Fix:** Add a confirmation step:

```typescript
const onDelete = async (id: string) => {
  if (!window.confirm('Are you sure you want to delete this product?')) return;
  // ... proceed with deletion
};
```

_(Even better: use a custom confirmation modal instead of `window.confirm`.)_

---

### 13. Unsafe type assertion in `ProductDetail`

**File:** `src/components/ProductDetail/index.tsx` (line 66)

`response.data as Product` bypasses TypeScript safety. The `updateProduct` API can return `{ success: false }` with no `data` field.

```diff
- const updatedProduct = response.data as Product;
+ if (!response.data) return;
+ const updatedProduct = response.data;
```

---

## Medium — Code Quality & Maintainability

### 14. `console.log` statements left in production code

| File                           | Line |
| ------------------------------ | ---- |
| `src/pages/HomePage.tsx`       | 51   |
| `src/pages/AddProductPage.tsx` | 11   |
| `src/pages/AddProductPage.tsx` | 17   |

**Fix:** Remove all `console.log` calls. Add an ESLint rule: `"no-console": "warn"`.

---

### 16. Inconsistent API response shapes

| Method               | Response shape                                                  |
| -------------------- | --------------------------------------------------------------- |
| `fetchProducts`      | `{ data: { data, page, limit, totalPages }, success, message }` |
| `findProductsByName` | `{ data, totalPages, limit, success, message }` (flat)          |
| `deleteProduct`      | `{ success, message }` (no `data` field)                        |

**Fix:** Define a consistent generic response type:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  totalPages: number;
}
```

---

### 17. `useDebounce` has incorrect TypeScript type for the timer ref

**File:** `src/hooks/useDebounce.ts` (line 5)

`setTimeout` returns `ReturnType<typeof setTimeout>` (which is `NodeJS.Timeout` when `@types/node` is installed). Assigning it to `number` is a type mismatch.

```diff
- const debouncedValueRef = useRef<number | null>(null);
+ const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

---

### 18. `ProductType` is not exported

**File:** `src/types/Product.ts` (line 17)

It's used in the `Product` interface (which is exported), but `ProductType` itself is unexported. Consumers that need to reference the category type directly can't.

```diff
- type ProductType =
+ export type ProductType =
```

---

### 19. `htmlFor` on labels doesn't match any `id` on inputs

**File:** `src/components/ProductForm/index.tsx` (lines 75–88, etc.)

Labels use `htmlFor="name"`, `htmlFor="brand"`, etc., but `react-hook-form`'s `register()` doesn't add `id` attributes. The labels aren't linked to their inputs.

**Fix:** Add `id` to each input:

```diff
  <input
+     id="name"
      type="text"
      className="form-input"
      {...register("name", { required: "This input is required." })}
  />
```

---

### 20. Pagination "Order" column doesn't account for page offset

**File:** `src/components/ProductList/index.tsx` (line 85)

On page 2 (with 10 items per page), order numbers show 1–10 instead of 11–20.

**Fix:** Pass `limit` as a prop and calculate the offset:

```diff
- <div className="product__cell">{index + 1}</div>
+ <div className="product__cell">
+     {(currentPage - 1) * limit + index + 1}
+ </div>
```

---

### 21. Redundant wrapper elements

**File:** `src/pages/HomePage.tsx` (line 128) — unnecessary outer `<div>`
**File:** `src/components/ProductForm/index.tsx` (line 68) — unnecessary `<>` fragment

```diff
  // HomePage.tsx
  return (
-     <div>
-         <div className="container">
-             ...
-         </div>
-     </div>
+     <div className="container">
+         ...
+     </div>
  );
```

```diff
  // ProductForm/index.tsx
  return (
-     <>
-         <form ...>
-             ...
-         </form>
-     </>
+     <form ...>
+         ...
+     </form>
  );
```

---

### 22. Duplicate `font-size` declaration in CSS

**File:** `src/index.css` (lines 28–30)

```diff
  body {
      font-family: "Courier New", Courier, monospace;
      font-style: normal;
      font-size: 1.6rem;
      font-weight: 400;
      overflow: auto;
-     font-size: 1.6rem;
  }
```

---

### 23. No loading state during mutations (create / update / delete)

When a user clicks "Submit" or "DELETE", there's no loading indicator or button disabling. Users can double-click and submit duplicate requests.

**Fix:** Use `react-hook-form`'s built-in `isSubmitting` for forms:

```typescript
const {
    formState: { errors, isSubmitting },
} = useForm<NewProduct>({ ... });

<button type="submit" disabled={isSubmitting}>
    {isSubmitting ? "Submitting..." : "Submit"}
</button>
```

For delete, add local loading state and disable the button during the API call.

---

### 24. No Error Boundary

No React Error Boundary exists. A runtime error in any component crashes the entire app.

**Fix:** Add an Error Boundary component wrapping the routes:

```typescript
import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("ErrorBoundary caught:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return <div>Something went wrong. Please refresh the page.</div>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
```

Wrap in `AppRoutes.tsx`:

```typescript
<ErrorBoundary>
    <ProductProvider>
        <Routes>...</Routes>
    </ProductProvider>
</ErrorBoundary>
```

---

### 25. No lazy loading or code splitting

All pages are eagerly imported. As the app grows, the initial bundle becomes unnecessarily large.

**Fix:** Use `React.lazy` and `Suspense` in `AppRoutes.tsx`:

```typescript
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));
const AddProductPage = lazy(() => import("./pages/AddProductPage"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));

function AppRoutes() {
    return (
        <ProductProvider>
            <Suspense fallback={<div className="loader" />}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/products/new"
                        element={<AddProductPage />}
                    />
                    <Route
                        path="/products/:id"
                        element={<ProductDetail />}
                    />
                </Routes>
            </Suspense>
        </ProductProvider>
    );
}
```

---

## Low — Polish & Minor Improvements

| #   | Issue                                                                                     | Fix                                                                                               |
| --- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 26  | CSS is globally scoped — class names like `.container`, `.loader` can collide             | Use CSS Modules (`*.module.css`) or a scoping convention                                          |
| 27  | `localStorage` usage is scattered with raw string keys                                    | Create a `storage` utility with typed getter/setters                                              |
| 28  | `Search` fires `onSearch("")` on mount, triggering an unnecessary initial fetch           | Skip the initial effect run with a ref flag                                                       |
| 29  | `ProductDetail` manually destructures `product` into `previousData` shape (lines 135–144) | Create a utility `toNewProduct(product)` or use `Omit` transformation                             |
| 30  | Reducer default case silently returns state                                               | Use exhaustive switch: `default: const _exhaustive: never = action; return products;`             |
| 31  | `Partial<NewProduct>` in `updateProduct` is too permissive                                | Define `UpdateProductDTO` with only the updatable fields                                          |
| 32  | No `404` catch-all route                                                                  | Add `<Route path="*" element={<NotFound />} />` in `AppRoutes`                                    |
| 33  | Price displayed as raw number (e.g., `3300000`) without formatting                        | Use `Intl.NumberFormat` to format currency                                                        |
| 34  | Product table uses `div`-based layout with no ARIA roles                                  | Use semantic `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>` or add `role="grid"` ARIA attributes |
| 35  | No unit or integration tests                                                              | Add Vitest + React Testing Library for critical paths                                             |

---

## Summary

| Severity     | Count | Key Themes                                      |
| ------------ | ----- | ----------------------------------------------- |
| **Critical** | 6     | Data bugs, double-fetch, type coercion          |
| **High**     | 7     | Architecture violations, missing error handling |
| **Medium**   | 12    | Console logs, alerts, inconsistent APIs, a11y   |
| **Low**      | 10    | Polish, testing, code splitting, formatting     |

### Recommended Fix Order

1. **#1–#6** — Fix the actual bugs first
2. **#7–#9** — Clean up architecture (context, component coupling)
3. **#10–#13** — Add error handling and safety checks
4. **#14–#25** — Improve code quality and maintainability
5. **#26–#35** — Polish and long-term improvements
