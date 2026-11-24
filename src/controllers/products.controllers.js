import {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "../services/products.services.js";

export const getAllProducts = async (req, res) => {
  const category = req.query.category;
  try {
    const products = await getAllProductsService(category);
    if (products.length > 0) {
      res.send({
        mensaje: "Productos encontrados:",
        data: products,
      });
    } else {
      res.status(404).send({
        message: "¡Produto/s no encontrado/s!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error al obtener los productos",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  const id = req.params.id;
  if (id) {
    try {
      const product = await getProductByIdService(id);
      if (product) {
        res.status(200).send({
          mensaje: "Producto encontrado:",
          data: product,
        });
      } else {
        res.status(404).send({
          message: "¡Pructo no encontrado!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error al obtener el producto por ID",
        error: error.message,
      });
    }
  } else {
    res.status(400).send({
      message: "¡ID de producto es necesario!",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    if (!productData || Object.keys(productData).length === 0) {
      return res.status(400).send({
        message: "¡El producto no puede estar vacío!",
      });
    }
    const newProduct = await createProductService(productData);
    return res.status(201).send({
      mensaje: "¡Producto creado con éxito!",
      data: newProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error al crear el producto en el servidor",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const productData = req.body;
  if (!id) {
    return res
      .status(400)
      .send({ message: "¡El ID del producto es obligatorio!" });
  }

  if (!productData || Object.keys(productData).length === 0) {
    return res
      .status(400)
      .send({ message: "¡No enviaste datos para actualizar!" });
  }

  try {
    const updatedProduct = await updateProductService(id, productData);

    return res.status(200).send({
      mensaje: "¡Producto actualizado correctamente!",
      data: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error al actualizar el producto en el servidor",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .send({ message: "¡El ID del producto es obligatorio!" });
  }

  try {
    const deleteProduct = await deleteProductService(id);

    if (!deleteProduct) {
      return res.status(404).send({
        message: `¡No existe un producto con el ID ${id} a eliminar!`,
      });
    }

    return res.status(200).send({
      mensaje: "¡Producto eliminado correctamente!",
      idEliminado: id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error al eliminar el producto en el servidor",
      error: error.message,
    });
  }
};
