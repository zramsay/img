import { useState, useEffect } from "react";

export interface ImageRecord {
  url: string;
  title?: string;
  description?: string;
}

function useImageStorage() {
  const [db, setDb] = useState<IDBDatabase | undefined | null>(null);

  useEffect(() => {
    const idbOpen = () => {
      const request = indexedDB.open("imagesDatabase", 1);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("images")) {
          db.createObjectStore("images", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = (event) => {
        setDb((event.target as IDBOpenDBRequest).result as IDBDatabase);
      };

      request.onerror = (event) => {
        console.error(
          "IndexedDB opening error:",
          (event.target as IDBOpenDBRequest).error,
        );
      };
    };
    idbOpen();
  }, []);

  async function storeImage(blob: Blob, title?: string, description?: string) {
    if (!db) {
      throw new Error("IndexDB is not initialized.");
    }

    const tx = db.transaction("images", "readwrite");
    const store = tx.objectStore("images");
    const timestamp = new Date();
    const imageRecord = { blob, title, description, timestamp };
    store.add(imageRecord);

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(imageRecord);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function fetchImages() {
    if (!db) {
      throw new Error("IndexDB is not initialized.");
    }

    const tx = db.transaction("images", "readonly");
    const store = tx.objectStore("images");

    return new Promise<ImageRecord[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        resolve(
          request.result.reverse().map((imgRecord) => ({
            url: URL.createObjectURL(imgRecord.blob),
            title: imgRecord.title,
            description: imgRecord.description,
          })),
        );
      };
      request.onerror = () => reject(request.error);
    });
  }

  return { storeImage, fetchImages, isLoading: !db };
}

export { useImageStorage };
