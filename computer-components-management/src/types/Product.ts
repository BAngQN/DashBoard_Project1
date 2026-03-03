export interface Product {
    id: string;
    name: string;
    category: ProductType;
    brand: string;
    price: number;
    quantity: number;
    description: string;
    imgUrl: string;
    specifications?: Record<string, string>;
    createdAt: string;
    updatedAt: string;
}

export type NewProduct = Omit<Product, "id" | "createdAt" | "updatedAt">;

export type UpdateProductDTO = Partial<
    Pick<
        NewProduct,
        | "name"
        | "category"
        | "brand"
        | "price"
        | "quantity"
        | "description"
        | "imgUrl"
        | "specifications"
    >
>;

export type ProductType =
    | "keyboard"
    | "mouse"
    | "monitor"
    | "headset"
    | "webcam"
    | "speaker";

export const PRODUCT_TYPES: ProductType[] = [
    "keyboard",
    "mouse",
    "monitor",
    "headset",
    "webcam",
    "speaker",
];
