import type { ObjectStore } from "./UseIndexedDB/type";
import Config from "./UseIndexedDB/config";
// import indexedDBWorker from "./UseIndexedDB/worker?worker";

interface Index {
  name: string;
  keyPath: string | string[];
  options?: IDBIndexParameters;
}

type Key = string | number | symbol;
interface Store<StoreName extends string, Data extends Record<Key, unknown>> {
  name: StoreName;
  data?: Data;
  options?: IDBObjectStoreParameters;
  indexes?: Index[];
}

type EventType = keyof IDBOpenDBRequestEventMap;
type RequestCallBack<T> = (result: T, request?: IDBRequest<T>) => unknown;

interface Operator<T> {
  type: EventType;
  fn: RequestCallBack<T>;
  options?: AddEventListenerOptions | boolean;
}

type RequestEvent<T> = Partial<Record<`on${EventType}`, RequestCallBack<T>>>;

type DBOperator = Operator<IDBDatabase>;
type DBRequestEvent = RequestEvent<IDBDatabase>;

interface Options<StoreName extends string, Data extends Record<Key, unknown>> {
  name: string;
  stores: Store<StoreName, Data>[];
  events?: DBRequestEvent;
  version?: number;
  config?: Partial<typeof Config>;
}

// * transform IDBRequest to async Promise
function transformRequestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error));
  });
}

export class IndexedDB<
  StoreName extends string,
  Data extends Record<Key, unknown>
> {
  options: Options<StoreName, Data>;
  config: typeof Config;
  openDBRequest?: IDBOpenDBRequest;
  private _idb?: IDBDatabase;

  get idb() {
    if (this._idb === undefined) throw new Error("IndexDB undefined");
    return this._idb;
  }
  set idb(idb: IDBDatabase) {
    this._idb = idb;
  }

  get name() {
    return this.idb.name;
  }

  get version() {
    return this.idb.version;
  }

  open(name = this.name, version?: number) {
    return indexedDB.open(name, version);
  }

  // * mount operators to indexedDB request
  listen(
    fn: DBOperator["fn"],
    type?: DBOperator["type"],
    options?: DBOperator["options"]
  ): unknown;
  listen(operators: DBOperator | DBOperator[]): unknown;
  listen(
    operators: unknown,
    type: DBOperator["type"] = "success",
    options?: DBOperator["options"]
  ) {
    if (isFunction(operators))
      operators = {
        type,
        fn: operators,
        options,
      };
    if (!isArray(operators)) operators = [operators];

    const request = this.open();

    for (const operator of <DBOperator[]>operators) {
      const { type, fn, options } = operator;
      request.addEventListener(
        type,
        () => fn(request.result, request),
        options
      );
    }
  }

  // * add callback function to request event
  addEvent(events: DBRequestEvent, request = this.open()) {
    for (const [key, fn] of Object.entries(events)) {
      // * remove 'on' prefix to get event type
      const type = <EventType>key.substring(2);
      request.addEventListener(type, () => fn(request.result, request));
    }
  }

  constructor(options: Options<StoreName, Data>) {
    this.config = options.config ? { ...Config, ...options.config } : Config;
    this.options = options;
  }

  async init() {
    const { name, stores, events, version } = this.options;
    const { isDropDatabaseIfExist, isAutoCreateStore } = this.config;

    // * delete database if exist
    if (isDropDatabaseIfExist) this.drop(name);

    const request = this.open(name, version);

    const onupgradeneeded = () => {
      for (const {
        name: storeName,
        options: storeOptions,
        indexes,
      } of stores) {
        // * create stores
        const store = request.result.createObjectStore(storeName, storeOptions);

        // * create indexes
        if (indexes) {
          for (const {
            name: indexName,
            keyPath,
            options: indexOptions,
          } of indexes) {
            store.createIndex(indexName, keyPath, indexOptions);
          }
        }
      }
    };

    const onsuccess = () => {
      const idb = request.result;
      // TODO: fix behavior when upgrade version (close indexedDB at present)
      idb.addEventListener("versionchange", () => idb.close());
      this._idb = idb;
    };

    this.addEvent({ onsuccess }, request);
    if (isAutoCreateStore) this.addEvent({ onupgradeneeded }, request);
    if (events) this.addEvent(events, request);

    this.openDBRequest = request;
    return transformRequestToPromise(request);
  }

  // * if storeName is not array,then auto get objectStore
  transaction(storeName: StoreName, mode?: IDBTransactionMode): IDBObjectStore;
  transaction(
    storeName: StoreName[],
    mode?: IDBTransactionMode
  ): IDBTransaction;
  transaction(storeName: StoreName | StoreName[], mode?: IDBTransactionMode) {
    const transaction = this.idb.transaction(storeName, mode);

    if (isArray(storeName)) {
      return transaction;
    } else {
      return transaction.objectStore(storeName);
    }
  }

  store(storeName: StoreName, mode: IDBTransactionMode = "readwrite") {
    const store = this.transaction(storeName, mode);
    for (const key of this.config.objectStoreMethods) {
      // ! cause illegal invocation if not bind store
      const fn = store[key].bind(store);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store[key] = (...arg) => transformRequestToPromise(fn(...arg));
    }
    return <ObjectStore>(<unknown>store);
  }

  clear(storeName: StoreName | StoreName[]) {
    if (!isArray(storeName)) storeName = [storeName];
    return Promise.all(storeName.map((name) => this.store(name).clear()));
  }

  cursor(
    storeName: StoreName,
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection
  ) {
    return this.store(storeName).openCursor(query, direction);
  }

  close() {
    this.idb.close();
  }

  deleteStore(storeName: StoreName) {
    const request = this.open(this.name, this.version + 1);
    request.addEventListener("upgradeneeded", () => {
      const idb = request.result;
      idb.deleteObjectStore(storeName);
      this._idb = idb;
    });
    return transformRequestToPromise(request);
  }

  drop(name = this.name) {
    indexedDB.deleteDatabase(name);
  }
}
