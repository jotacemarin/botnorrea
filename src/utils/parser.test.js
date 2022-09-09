const { stringToJSON, createResponse, createErrorResponse } = require("./parser");

describe("stringToJSON test suites", () => {
  test("return a correct JSON", () => {
    const result = stringToJSON("{\"test\":\"test\"}")
    expect(result).toEqual({test:"test"})
  });

  test("throws an error when is invalid object", () => {
    const result = () => stringToJSON("test");
    expect(result).toThrow(Error)
    expect(result).toThrow("stringToJSON: Unexpected token e in JSON at position 1")
  });
});

describe("createResponse test suites", () => {
  test("return default for empty values", () => {
    const result = createResponse();
    expect(result.headers).toBeTruthy();
    expect(result.statusCode).toEqual(200);
  });

  test("return OK with body", () => {
    const result = createResponse({test:"test"});
    expect(result.body).toMatch(/{\"test\":\"test\"}/);
    expect(result.statusCode).toEqual(200);
  });

  test("return diferent statusCode with body", () => {
    const result = createResponse({test:"test"}, 500);
    expect(result.body).toMatch(/{\"test\":\"test\"}/);
    expect(result.statusCode).toEqual(500);
  });

  test("return diferent statusCode without body", () => {
    const result = createResponse(null, 500);
    expect(result.body).toBeFalsy();
    expect(result.statusCode).toEqual(500);
  });
});

describe("createErrorResponse test suites", () => {
  test("return with default vaules", () => {
    const result = createErrorResponse();
    expect(result.body).toMatch(/{\"error\":\"\"}/);
    expect(result.statusCode).toEqual(500);
  });

  test("return with vaules", () => {
    const result = createErrorResponse("not found", 404);
    expect(result.body).toMatch(/{\"error\":\"not found\"}/);
    expect(result.statusCode).toEqual(404);
  });
});
