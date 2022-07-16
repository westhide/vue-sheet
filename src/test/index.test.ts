export default describe("suite name", () => {
  it("init", () => {
    expect(1 + 1).toEqual(2);
    console.log("vitest init");
  });

  it("snapshot", () => {
    expect(1 + 1).toMatchSnapshot();
  });
});
