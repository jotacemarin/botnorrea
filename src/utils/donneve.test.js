process.env.DONNEVE_API = "test";

const mockAxios = require("axios");
const { createCode } = require("./donneve");

describe("Fetch donneve API respond successfull", () => {
  const code = "TEST12345";

  beforeEach(() => {
    mockAxios.post.mockImplementation(() =>
      Promise.resolve({ data: { code } })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Fetch createCode", async () => {
    const response = await createCode({});
    expect(response).toEqual(code);
  });
});

describe("Fetch donneve API respond reject", () => {
  beforeEach(() => {
    mockAxios.post.mockImplementation(() =>
      Promise.reject({ response: { data: { error: "Test" } } })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Fetch createCode reject", () => {
    const response = async () => await createCode({});
    expect(response).rejects.toThrow(Error);
  });
});
