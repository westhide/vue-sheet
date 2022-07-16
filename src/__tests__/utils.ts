export {};

describe("utils", () => {
  describe("@vueuse", () => {
    it("useChangeCase", () => {
      const str = useChangeCase("west_hide", "camelCase").value;
      expect(str).toMatchInlineSnapshot('"westHide"');
    });
  });

  describe("UseArray.ts", () => {
    it("arrayReplace", () => {
      const target = [1, 2, 3];
      arrayReplace(target, 2, 4);
      expect(target).toEqual([1, 4, 3]);
      arrayReplace(target, [[3, 5]]);
      expect(target).toEqual([1, 4, 5]);
    });

    it("reduceFilter", () => {
      const target = [1, 2, 3];
      expect(reduceFilter(target)).toEqual(target);
      const fns = [(v: number) => v !== 2];
      expect(reduceFilter(target, fns)).toEqual([1, 3]);
    });
  });

  describe("UseIs.ts", () => {
    it("isArray", () => {
      expect(isArray([])).toEqual(true);
    });
  });

  describe("UseObject.ts", () => {
    it("objectKeys", () => {
      expect(objectKeys({ a: 1, b: 2, c: 3 })).toEqual(["a", "b", "c"]);
    });
  });
});
