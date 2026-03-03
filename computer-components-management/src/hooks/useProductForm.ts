import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { PRODUCT_TYPES, type NewProduct } from "../types/Product";

export const useProductForm = (
    previousData?: NewProduct,
    onSubmitProduct?: (data: NewProduct) => void,
) => {
    const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(
        previousData?.specifications
            ? Object.entries(previousData.specifications).map(
                  ([key, value]) => ({ key, value }),
              )
            : [],
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
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
            {} as Record<string, string>,
        );

        onSubmitProduct?.({
            ...data,
            specifications,
        });
    };

    return {
        specs,
        register,
        handleSubmit,
        errors,
        isSubmitting,
        addSpec,
        removeSpec,
        updateSpec,
        onSubmitForm,
    };
};
