import {
  getById,
  getProducts,
  searchByQuery,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../models/products.models.js";

export const getAllProductsService = async (category) => {
  if (category) {
    const products_q = await searchByQuery(category);
    return products_q;
  } else {
    const products = await getProducts();
    return products;
  }
};

export const getProductByIdService = async (id) => {
  const product = await getById(id);
  return product;
};

export const createProductService = async (productData) => {
  const newProduct = await addProduct(productData);
  return newProduct;
};

export const updateProductService = async (id, productData) => {
  const updatedProduct = await updateProduct(id, productData);
  return updatedProduct;
};

export const deleteProductService = async (id) => {
  const deletedId = await deleteProduct(id);
  return deletedId;
};
