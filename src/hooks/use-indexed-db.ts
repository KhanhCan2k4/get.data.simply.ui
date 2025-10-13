import { IDBPDatabase, openDB } from "idb";

const DB_NAME = "GET_DATA_SIMPLY";

type StoredData<T> = {
  _key: string | number;
  _data: T;
  _created_at: Date;
  _updated_at: Date;
};

/**
 * use indexed database to handle data in a specific object store/collection
 *
 * @param storeName object store/collection's name
 * @returns
 */
export default function useIndexedDB<T>(storeName: string) {
  //   METHODS
  /**
   * to get the current database reference
   * open indexed database to start handling
   * create new collection if it not existing
   *
   * @returns Promise<IDBPDatabase> the database reference
   */
  const getDB = async (): Promise<IDBPDatabase> => {
    // GET DATABASE'S CONFIGS
    let db = await openDB(DB_NAME);
    let version = db.version;

    if (!db.objectStoreNames.contains(storeName)) {
      //   UPDATE VERSION
      db.close();
      version++;

      db = await openDB(DB_NAME, version, {
        upgrade(db) {
          db.createObjectStore(storeName);
          version = db.version;
        },
      });
    }

    return db;
  };

  /**
   * to get all data from a specific object store/collection
   *
   * @template T
   * @returns Promise<StoredData<T>[]>
   */
  const findAll = async (): Promise<StoredData<T>[]> => {
    const db = await getDB();

    const transaction = db.transaction(storeName, "readonly");

    const store = transaction.objectStore(storeName);

    const storedDataList = (await store.getAll()) as StoredData<T>[];

    db.close();

    return storedDataList;
  };

  /**
   * to get one data object from a specific object store/collection by its data/key
   *
   * @template T
   * @param query search by object/key
   * @returns Promise<StoredData<T> | null>
   */
  const findOne = async (
    query: Partial<T> | string | number
  ): Promise<StoredData<T> | null> => {
    const db = await getDB();

    const transaction = db.transaction(storeName, "readonly");

    const store = transaction.objectStore(storeName);

    const keys = await store.getAllKeys();

    let value: StoredData<T> | null = null;
    if (typeof query === "number" || typeof query === "string") {
      value = await store.get(query);
    } else {
      for (const key of keys) {
        value = await store.get(key);

        if (
          value &&
          Object.entries(query).every(
            ([key, val]) => (value?._data as any)[key] === val
          )
        ) {
          break;
        }

        value = null;
      }
    }

    db.close();

    return value;
  };

  /**
   * to create new item and store it into database
   *
   * @param data
   * @param key
   * @returns Promise<boolean>
   */
  const create = async (data: T, key: string | number): Promise<boolean> => {
    const db = await getDB();

    const transaction = db.transaction(storeName, "readwrite");

    const store = transaction.objectStore(storeName);

    const storedData: StoredData<T> = {
      _key: key,
      _data: data,
      _created_at: new Date(),
      _updated_at: new Date(),
    };

    const isCreated = store
      .add(storedData, key)
      .then(() => true)
      .catch(() => false);

    db.close();

    return isCreated;
  };

  /**
   * to update data of an item based on its old value
   *
   * @param query search by object/key
   * @param onUpdate
   * @returns Promise<boolean>
   */
  const update = async (
    query: Partial<T> | string | number,
    onUpdate: (oldValue: T) => T
  ): Promise<boolean> => {
    const oldValue = await findOne(query);

    if (!oldValue) {
      return false;
    }

    let db = await getDB();

    const transaction = db.transaction(storeName, "readwrite");

    const store = transaction.objectStore(storeName);

    const newValue = onUpdate(oldValue._data);

    const newStoredData: StoredData<T> = {
      ...oldValue,
      _data: newValue,
      _updated_at: new Date(),
    };

    const isUpdated = store
      .put(newStoredData, oldValue._key)
      .then(() => true)
      .catch(() => false);

    db.close();

    return isUpdated;
  };

  /**
   * to remove an item queried by object/key
   *
   * @param storeName
   * @param query
   * @returns
   */
  const remove = async (
    query: Partial<T> | string | number
  ): Promise<boolean> => {
    const db = await getDB();

    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    const keys = await store.getAllKeys();

    const handleDelete = (key: IDBValidKey | string | number) => {
      return store
        .delete(key)
        .then(() => true)
        .catch(() => false);
    };

    let isDeleted: boolean = false;
    if (typeof query === "number" || typeof query === "string") {
      isDeleted = await handleDelete(query);
    } else {
      for (const key of keys) {
        let value: T | null = await store.get(key);

        if (
          value &&
          Object.entries(query).every(
            ([key, val]) => (value as any)[key] === val
          )
        ) {
          isDeleted = await handleDelete(key);
          break;
        }
      }
    }

    db.close();

    return isDeleted;
  };

  return { findAll, findOne, create, update, remove };
}
