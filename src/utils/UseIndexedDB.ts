import Config from "./UseIndexedDB/config";

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

interface InitOptions<
  StoreName extends string,
  Data extends Record<Key, unknown>
> {
  name: string;
  stores: Store<StoreName, Data>[];
  events?: DBRequestEvent;
  version?: number;
  isDeleteIfExist?: boolean;
}

export class IndexedDB<
  StoreName extends string,
  Data extends Record<Key, unknown>
> {
  stores: Store<StoreName, Data>[];
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

  /// mount operators to indexedDB request
  mount(
    fn: DBOperator["fn"],
    type?: DBOperator["type"],
    options?: DBOperator["options"]
  ): unknown;
  mount(operators: DBOperator | DBOperator[]): unknown;
  mount(
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

  /// hook callback function to request event
  hook(events: DBRequestEvent, request = this.open()) {
    for (const [key, fn] of Object.entries(events)) {
      const type = <EventType>key.substring(2);
      request.addEventListener(type, () => fn(request.result, request));
    }
  }

  constructor({
    name,
    stores,
    events = {},
    version,
    isDeleteIfExist = Config.isDeleteIfExist,
  }: InitOptions<StoreName, Data>) {
    /// delete database if exist
    if (isDeleteIfExist) this.drop(name);

    const request = this.open(name, version);

    const onupgradeneeded = () => {
      /// create stores
      for (const {
        name: storeName,
        options: storeOptions,
        indexes,
      } of stores) {
        const store = request.result.createObjectStore(storeName, storeOptions);

        /// create indexes
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
      this._idb = request.result;
    };

    this.hook({ onupgradeneeded, onsuccess, ...events }, request);

    this.stores = stores;
  }

  /// if storeName is not array,then auto get objectStore
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
    return this.transaction(storeName, mode);
  }

  clear(storeName: StoreName | StoreName[]) {
    if (!isArray(storeName)) storeName = [storeName];
    for (const name of storeName) this.store(name).clear();
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
    this.close();
    const request = this.open(this.name, this.version + 1);
    request.onupgradeneeded = () => {
      const idb = request.result;
      idb.deleteObjectStore(storeName);
      this._idb = idb;
    };
  }

  drop(name = this.name) {
    indexedDB.deleteDatabase(name);
  }
}
