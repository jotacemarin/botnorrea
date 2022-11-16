process.env.MAIN_CHAT = 1;

const { logger } = require("./logger");

describe("Test suite for logger", () => {
  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("The chat is not for development", () => {
    const context = {
      message: {
        chat: {
          id: 2,
        },
      },
    };
    logger(context);
    expect(console.log).not.toHaveBeenCalled();
  });

  test("The chat is for development", () => {
    const context = {
      message: {
        chat: {
          id: 1,
        },
      },
    };
    logger(context);
    expect(console.log).toHaveBeenCalled();
  });
});
