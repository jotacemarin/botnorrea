process.env.BOT_NAME = "test";
process.env.MAIN_CHAT = 1;

jest.mock("../persistence/redis");
const redisMethods = require("../persistence/redis");
const getKeySpy = jest.spyOn(redisMethods, "getKey");
const setKeySpy = jest.spyOn(redisMethods, "setKey");

const {
  haveCredentials,
  cleanMessage,
  getMessageId,
  getChatId,
  getNewPermissions,
  setRedis,
  isEnabled,
} = require("./telegraf");

describe("Test suite for haveCredentials", () => {
  test("Context param is null/undefined or not declared", () => {
    const result = () => haveCredentials();
    expect(result).toThrow(Error);
    expect(result).toThrow("Cannot read property 'message' of undefined");
  });

  test("User properties are missing", () => {
    const context = {
      message: {
        from: {},
      },
    };
    const result = () => haveCredentials(context);
    expect(result).toThrow(Error);
    expect(result).toThrow(
      "`Please set a *first name*, *last name* or *username* in your telegram account to use botnorrea!`"
    );
  });

  test("User have username", () => {
    const context = {
      message: {
        from: {
          username: "test",
        },
      },
    };
    const result = () => haveCredentials(context);
    expect(result).not.toThrow();
    expect(result()).toBeFalsy();
    expect(result()).toBeNull();
  });

  test("User have first_name", () => {
    const context = {
      message: {
        from: {
          first_name: "test",
        },
      },
    };
    const result = () => haveCredentials(context);
    expect(result).not.toThrow();
    expect(result()).toBeFalsy();
    expect(result()).toBeNull();
  });

  test("User have last_name", () => {
    const context = {
      message: {
        from: {
          last_name: "test",
        },
      },
    };
    const result = () => haveCredentials(context);
    expect(result).not.toThrow();
    expect(result()).toBeFalsy();
    expect(result()).toBeNull();
  });
});

describe("Test suite for cleanMessage", () => {
  test("First happy path", () => {
    const result = cleanMessage("/gossip@botnorrea_bot test");
    expect(result).toMatch(/test/);
  });

  test("Second happy path", () => {
    const result = cleanMessage("/gossip test");
    expect(result).toMatch(/test/);
  });

  test("Third happy path", () => {
    const result = cleanMessage("test");
    expect(result).toMatch(/test/);
  });

  test("Avoid external error", () => {
    const result = cleanMessage();
    expect(result).toMatch(/undefined/);
  });
});

describe("Test suite for getMessageId", () => {
  test("Happy path", () => {
    const context = {
      message: { message_id: 1 },
    };
    const result = () => getMessageId(context);
    expect(result).not.toThrow();
    expect(result()).toEqual({ reply_to_message_id: 1 });
  });

  test("When catch an error return a empty object", () => {
    const result = () => getMessageId();
    expect(result).not.toThrow();
    expect(result()).not.toBeNull();
    expect(result()).toBeDefined();
    expect(result()).toEqual({});
  });
});

describe("Test suite for getChatId", () => {
  test("Happy path", () => {
    const context = {
      message: {
        chat: {
          id: 1,
        },
      },
    };
    const result = getChatId(context);
    expect(result).toEqual(1);
  });

  test("Group is not configured on bot", () => {
    const context = {
      message: {
        chat: {
          id: 3,
        },
      },
    };
    const result = () => getChatId(context);
    expect(result).toThrow(Error);
    expect(result).toThrow(
      "This group is not configured for @botnorrea_bot, please contact with Admin"
    );
  });

  test("Param is malformed, null or undefined", () => {
    const result = () => getChatId();
    expect(result).toThrow(Error);
    expect(result).toThrow("Cannot read property 'message' of undefined");
  });
});

describe("Test suite for getNewPermissions", () => {
  test("First happy path", () => {
    const result = getNewPermissions();
    const everyResult = Object.entries(result).every(([_key, value]) => value);
    expect(everyResult).toBeTruthy();
  });

  test("Second happy path", () => {
    const result = getNewPermissions(false);
    const everyResult = Object.entries(result).every(([_key, value]) => value);
    expect(everyResult).toBeFalsy();
  });
});

describe("Test suite for setRedis", () => {
  beforeAll(() => {
    setKeySpy.mockImplementation(() => undefined);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("When redis key have a truthy value", async () => {
    getKeySpy.mockImplementation(() => "1");
    await setRedis("test");
    expect(getKeySpy).toHaveBeenCalled();
    expect(setKeySpy).not.toHaveBeenCalled();
  });

  test("When redis key have a falsy value", async () => {
    getKeySpy.mockImplementation(() => null);
    await setRedis("test");
    expect(getKeySpy).toHaveBeenCalled();
    expect(setKeySpy).toHaveBeenCalled();
  });
});

describe("test suite for isEnabled", () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("Happy path when command is enable", async () => {
    getKeySpy.mockImplementation(() => "1");
    const result = await isEnabled("test");
    expect(result).toBeNull();
    expect(getKeySpy).toHaveBeenCalled();
  });

  test("Should return an error when command is disabled", async () => {
    getKeySpy.mockImplementation(() => null);
    const result = () => isEnabled("test");
    expect(result).rejects.toThrow(Error);
  });
});
