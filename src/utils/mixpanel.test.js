process.env.MIX_PANEL_API_KEY = 'test'

jest.mock("mixpanel", () => ({
  init: () => ({
    people: {
      set: jest.fn(),
      increment: jest.fn(),
    },
    track: jest.fn()
  }),
}));

const { trackMessage, trackCommand } = require("./mixpanel");

describe('trackUser test suite', () => {
  const message = {
    from: { id: 1 },
    text: 'test'
  }

  test('trackMessage test case have', () => {
    expect(() => trackMessage({ message })).not.toThrow();
  });

  test('trackCommand test case', () => {
    expect(() => trackCommand('test', { message })).not.toThrow();
  });
});