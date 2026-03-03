import type { NewProduct, Product } from "../types/Product";

export const toNewProduct = ({ ...newProduct }: Product): NewProduct =>
    newProduct;
