import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  writeBatch,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase";
import { ShoppingItem } from "../types";

const COLLECTION_NAME = "shopping-items";

export const subscribeToItems = (callback: (items: ShoppingItem[]) => void) => {
  if (!db) return () => {};

  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items: ShoppingItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({ 
        id: doc.id, 
        name: data.name,
        category: data.category,
        price: data.price || 0, // Default ke 0 jika tidak ada
        isChecked: data.isChecked,
        createdAt: data.createdAt
      } as ShoppingItem);
    });
    callback(items);
  }, (error) => {
    console.error("Error fetching items:", error);
    callback([]);
  });

  return unsubscribe;
};

export const addItemToFirebase = async (name: string, category: string, price: number = 0) => {
  if (!db) {
    console.warn("Firebase not initialized");
    return;
  }
  try {
    await addDoc(collection(db, COLLECTION_NAME), {
      name,
      category,
      price,
      isChecked: false,
      createdAt: Date.now()
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const toggleItemStatus = async (id: string, currentStatus: boolean) => {
  if (!db) return;
  const itemRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(itemRef, {
    isChecked: !currentStatus
  });
};

export const updateItemPrice = async (id: string, newPrice: number) => {
  if (!db) return;
  const itemRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(itemRef, {
    price: newPrice
  });
};

export const updateItemName = async (id: string, newName: string) => {
  if (!db) return;
  const itemRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(itemRef, {
    name: newName
  });
};

export const deleteItemFromFirebase = async (id: string) => {
  if (!db) return;
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};

export const deleteCheckedItems = async () => {
  if (!db) return;

  try {
    const q = query(collection(db, COLLECTION_NAME), where("isChecked", "==", true));
    const querySnapshot = await getDocs(q);

    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  } catch (e) {
    console.error("Error deleting checked items: ", e);
    throw e;
  }
};

export const deleteUncheckedItems = async () => {
  if (!db) return;

  try {
    const q = query(collection(db, COLLECTION_NAME), where("isChecked", "==", false));
    const querySnapshot = await getDocs(q);

    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  } catch (e) {
    console.error("Error deleting unchecked items: ", e);
    throw e;
  }
};

export const deleteAllItemsFromFirebase = async () => {
  if (!db) return;

  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);

    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  } catch (e) {
    console.error("Error deleting all items: ", e);
    throw e;
  }
};

export const addMultipleItems = async (items: {name: string, category: string, price?: number}[]) => {
    if (!db) return;
    
    const batch = writeBatch(db);
    const collectionRef = collection(db, COLLECTION_NAME);

    items.forEach(item => {
        const docRef = doc(collectionRef);
        batch.set(docRef, {
            name: item.name,
            category: item.category,
            price: item.price || 0,
            isChecked: false,
            createdAt: Date.now()
        });
    });

    try {
        await batch.commit();
    } catch (e) {
        console.error("Error batch adding documents: ", e);
        throw e;
    }
};