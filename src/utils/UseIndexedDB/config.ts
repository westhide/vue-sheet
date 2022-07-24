export type ObjectStoreMethods =
  | "add"
  | "put"
  | "delete"
  | "clear"
  | "count"
  | "get"
  | "getKey"
  | "getAll"
  | "getAllKeys"
  | "openCursor"
  | "openKeyCursor";

export default {
  isDropDatabaseIfExist: false,
  isAutoCreateStore: true,
  objectStoreMethods: <ObjectStoreMethods[]>[
    "add",
    "put",
    "delete",
    "clear",
    "count",
    "get",
    "getKey",
    "getAll",
    "getAllKeys",
    "openCursor",
    "openKeyCursor",
  ],
};
