export interface ObjectStore {
  readonly autoIncrement: boolean;
  readonly indexNames: DOMStringList;
  readonly keyPath: string | string[];
  name: string;
  readonly transaction: IDBTransaction;
  add(value: unknown, key?: IDBValidKey): Promise<IDBRequest<IDBValidKey>>;
  clear(): Promise<IDBRequest<undefined>>;
  count(query?: IDBValidKey | IDBKeyRange): Promise<IDBRequest<number>>;
  createIndex(
    name: string,
    keyPath: string | string[],
    options?: IDBIndexParameters
  ): IDBIndex;
  delete(query: IDBValidKey | IDBKeyRange): Promise<IDBRequest<undefined>>;
  deleteIndex(name: string): void;
  get(query: IDBValidKey | IDBKeyRange): Promise<IDBRequest<unknown>>;
  getAll(
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number
  ): Promise<IDBRequest<unknown[]>>;
  getAllKeys(
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number
  ): Promise<IDBRequest<IDBValidKey[]>>;
  getKey(
    query: IDBValidKey | IDBKeyRange
  ): Promise<IDBRequest<IDBValidKey | undefined>>;
  index(name: string): IDBIndex;
  openCursor(
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection
  ): Promise<IDBRequest<IDBCursorWithValue | null>>;
  openKeyCursor(
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection
  ): Promise<IDBRequest<IDBCursor | null>>;
  put(value: unknown, key?: IDBValidKey): Promise<IDBRequest<IDBValidKey>>;
}
