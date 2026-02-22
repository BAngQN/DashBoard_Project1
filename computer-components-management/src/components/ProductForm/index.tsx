import "./index.css";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { PRODUCT_TYPES, type NewProduct } from "../../types/Product";

interface ProductFormProps {
    previousData?: NewProduct;
    onSubmit: (data: NewProduct) => void;
}

function ProductForm({ previousData, onSubmit }: ProductFormProps) {
    const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(
        previousData?.specifications
            ? Object.entries(previousData.specifications).map(
                  ([key, value]) => ({ key, value })
              )
            : []
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NewProduct>({
        mode: "onSubmit",
        reValidateMode: "onChange",
        criteriaMode: "firstError",
        defaultValues: previousData || {
            name: "",
            brand: "",
            description: "",
            category: PRODUCT_TYPES[0],
            quantity: 0,
            price: 0,
            imgUrl: "",
            specifications: {},
        },
    });

    const addSpec = () => {
        setSpecs([...specs, { key: "", value: "" }]);
    };

    const removeSpec = (index: number) => {
        setSpecs(specs.filter((_, i) => i !== index));
    };

    const updateSpec = (index: number, field: "key" | "value", val: string) => {
        const newSpecs = [...specs];
        newSpecs[index][field] = val;
        setSpecs(newSpecs);
    };

    const onSubmitForm: SubmitHandler<NewProduct> = (data) => {
        const specifications = specs.reduce(
            (acc, spec) => {
                if (spec.key.trim() && spec.value.trim()) {
                    acc[spec.key.trim()] = spec.value.trim();
                }
                return acc;
            },
            {} as Record<string, string>
        );

        onSubmit({ ...data, specifications });
    };
    return (
        <>
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
                                <option value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="form-error">
                                {errors.category.message}
                            </p>
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
                                min: {
                                    value: 0,
                                    message: "Quantity cannot be negative.",
                                },
                            })}
                        />
                        {errors.quantity && (
                            <p className="form-error">
                                {errors.quantity.message}
                            </p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="price" className="form-label">
                            Price:
                        </label>
                        <input
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
                            type="text"
                            className="form-input"
                            {...register("imgUrl", {
                                required: "This input is required.",
                            })}
                        />
                        {errors.imgUrl && (
                            <p className="form-error">
                                {errors.imgUrl.message}
                            </p>
                        )}
                    </div>

                    <div className="form-group form-group--full">
                        <label className="form-label">Specifications:</label>
                        <div className="specs-container">
                            {specs.map((spec, index) => (
                                <div key={index} className="spec-row">
                                    <input
                                        type="text"
                                        placeholder="Key (e.g., RAM)"
                                        className="form-input spec-input"
                                        value={spec.key}
                                        onChange={(e) =>
                                            updateSpec(
                                                index,
                                                "key",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value (e.g., 16GB)"
                                        className="form-input spec-input"
                                        value={spec.value}
                                        onChange={(e) =>
                                            updateSpec(
                                                index,
                                                "value",
                                                e.target.value
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
                        <button type="submit" className="form-submit">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default ProductForm;
