import "./index.css";
import { useProductForm } from "../../hooks/useProductForm";
import { PRODUCT_TYPES, type NewProduct } from "../../types/Product";

interface ProductFormProps {
    previousData?: NewProduct;
    onSubmit: (data: NewProduct) => void;
}

function ProductForm({ previousData, onSubmit }: ProductFormProps) {
    const {
        specs,
        register,
        handleSubmit,
        errors,
        isSubmitting,
        addSpec,
        removeSpec,
        updateSpec,
        onSubmitForm,
    } = useProductForm(previousData, onSubmit);

    return (
        <form
            className="product__form  container"
            onSubmit={handleSubmit(onSubmitForm)}
        >
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="name" className="form-label">
                        Name:
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="form-input"
                        {...register("name", {
                            required: "This input is required.",
                        })}
                    />
                    {errors.name && (
                        <p className="form-error">{errors.name.message}</p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="brand" className="form-label">
                        Brand:
                    </label>
                    <input
                        id="brand"
                        type="text"
                        className="form-input"
                        {...register("brand", {
                            required: "This input is required.",
                        })}
                    />
                    {errors.brand && (
                        <p className="form-error">{errors.brand.message}</p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <input
                        id="description"
                        type="text"
                        className="form-input"
                        {...register("description", {
                            required: "This input is required.",
                        })}
                    />
                    {errors.description && (
                        <p className="form-error">
                            {errors.description.message}
                        </p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="category" className="form-label">
                        Category
                    </label>
                    <select
                        className="form-input"
                        {...register("category", {
                            required: "This input is required.",
                        })}
                    >
                        {PRODUCT_TYPES.map((type) => (
                            <option id={type} key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    {errors.category && (
                        <p className="form-error">{errors.category.message}</p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="quantity" className="form-label">
                        Quantity
                    </label>
                    <input
                        type="number"
                        className="form-input"
                        {...register("quantity", {
                            required: "This input is required.",
                            valueAsNumber: true,
                            min: {
                                value: 0,
                                message: "Quantity cannot be negative.",
                            },
                        })}
                    />
                    {errors.quantity && (
                        <p className="form-error">{errors.quantity.message}</p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="price" className="form-label">
                        Price:
                    </label>
                    <input
                        id="number"
                        type="number"
                        className="form-input"
                        {...register("price", {
                            required: "This input is required.",
                            min: {
                                value: 0,
                                message: "Price cannot be negative.",
                            },
                        })}
                    />
                    {errors.price && (
                        <p className="form-error">{errors.price.message}</p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="imgUrl" className="form-label">
                        Image URL:
                    </label>
                    <input
                        id="imgUrl"
                        type="text"
                        className="form-input"
                        {...register("imgUrl", {
                            required: "This input is required.",
                        })}
                    />
                    {errors.imgUrl && (
                        <p className="form-error">{errors.imgUrl.message}</p>
                    )}
                </div>

                <div className="form-group form-group--full">
                    <label className="form-label">Specifications:</label>
                    <div className="specs-container">
                        {specs.map((spec, index) => (
                            <div key={index} className="spec-row">
                                <input
                                    id={spec.key}
                                    type="text"
                                    placeholder="Key (e.g., RAM)"
                                    className="form-input spec-input"
                                    value={spec.key}
                                    onChange={(e) =>
                                        updateSpec(index, "key", e.target.value)
                                    }
                                />
                                <input
                                    id={spec.value}
                                    type="text"
                                    placeholder="Value (e.g., 16GB)"
                                    className="form-input spec-input"
                                    value={spec.value}
                                    onChange={(e) =>
                                        updateSpec(
                                            index,
                                            "value",
                                            e.target.value,
                                        )
                                    }
                                />
                                <button
                                    type="button"
                                    className="btn-remove"
                                    onClick={() => removeSpec(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn-add-spec"
                            onClick={addSpec}
                        >
                            + Add Specification
                        </button>
                    </div>
                </div>

                <div className="form-group form-group--full">
                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="form-submit"
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default ProductForm;
