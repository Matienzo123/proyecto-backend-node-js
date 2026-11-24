import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../data/data.js";

export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error obteniendo la colección PRODUCTS:`, error);
    throw error;
  }
};

export const getById = async (idDocumento) => {
  try {
    const docRef = doc(db, "products", idDocumento);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      `Error obteniendo el documento con ID ${idDocumento}:`,
      error,
    );
    throw error;
  }
};

export const searchByQuery = async (valor) => {
  try {
    const q = query(
      collection(db, "products"),
      where("categoria", "==", valor),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error realizando la consulta en products:`, error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, "products"), productData);
    return { id: docRef.id, ...productData };
  } catch (error) {
    console.error(`Error al crear el producto en la base de datos:`, error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, productData);
    return { id, ...productData };
  } catch (error) {
    console.error(`Error al actualizar el producto con ID ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }

    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error(`Error al eliminar el producto con ID ${id}:`, error);
    throw error;
  }
};
