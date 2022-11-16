const { deprecatedMessage } = require("./deprecated");

describe("Test deprecated module", () => {
  test("should pass test", () => {
    const value = deprecatedMessage("test");
    expect(value).toMatch(/\*Deprecated:\* Please use `\/test`./);
  });
});
