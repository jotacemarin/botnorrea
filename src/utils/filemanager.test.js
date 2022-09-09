process.env.DONNEVE_API = "test";

const mockAxios = require("axios");
const {
  buildTags,
  getRandom,
  searchByTags,
  setTags,
} = require("./filemanager");

const tags = ["test", "1234"];

describe("Test suite buildTags", () => {
  test("Return an empty string", () => {
    const result = buildTags();
    expect(result).toMatch("");
  });

  test("Return string with tags", () => {
    const result = buildTags(tags);
    expect(result).toMatch("\n\ntags: [ test | 1234 ]");
  });

  test("Return string with tags and custom label", () => {
    const result = buildTags(tags, "test");
    expect(result).toMatch("\n\ntest: [ test | 1234 ]");
  });
});

describe("Fetch getRandom API respond successfull", () => {
  beforeEach(() => {
    mockAxios.get.mockImplementation(() =>
      Promise.resolve({ data: { webContentUrl: "test", tags } })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Fetch getRandom", async () => {
    const response = await getRandom();
    expect(response).toEqual("test\n\ntags: [ test | 1234 ]");
  });
});

describe("Fetch getRandom API respond reject", () => {
  beforeEach(() => {
    mockAxios.get.mockImplementation(() =>
      Promise.reject({ response: { data: { error: "Test" } } })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Fetch getRandom reject", () => {
    const response = async () => await getRandom();
    expect(response).rejects.toThrow(Error);
  });
});

describe("Fetch searchByTags API respond successfull", () => {
  const mockImplementation = (mock) => () => Promise.resolve(mock);

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Fetch searchByTags", async () => {
    mockAxios.post.mockImplementation(
      mockImplementation({ data: [{ webContentUrl: "test", tags }] })
    );

    const response = await searchByTags(tags);
    expect(response).toEqual("test\n\ntags: [ test | 1234 ]");
  });

  test("Fetch searchByTags", async () => {
    mockAxios.post.mockImplementation(mockImplementation({ data: [] }));

    const response = () => searchByTags(tags);
    expect(response).rejects.toThrow(Error);
    expect(response).rejects.toThrow("Not media found");
  });
});

describe("Fetch searchByTags API respond reject", () => {
  beforeEach(() => {
    mockAxios.post.mockImplementation(() =>
      Promise.reject({ response: { data: { error: "Test" } } })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Fetch searchByTags reject", () => {
    const response = async () => await searchByTags(tags);
    expect(response).rejects.toThrow(Error);
  });
});

describe("Fetch setTags API respond successfull", () => {
  beforeEach(() => {
    mockAxios.post.mockImplementation(() =>
      Promise.resolve({
        data: {
          webContentUrl: "test",
          tags,
          newTags: tags.map((tag) => `${tag}1`),
        },
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Fetch setTags", async () => {
    const response = await setTags("test", tags);
    expect(response).toEqual(
      "test\n\ntags: [ test | 1234 ]\n\nnew tags: [ test1 | 12341 ]"
    );
  });
});

describe("Fetch setTags API respond reject", () => {
  beforeEach(() => {
    mockAxios.post.mockImplementation(() =>
      Promise.reject({ response: { data: { error: "Test" } } })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Fetch setTags reject", () => {
    const response = async () => await setTags("test", tags);
    expect(response).rejects.toThrow(Error);
  });
});
