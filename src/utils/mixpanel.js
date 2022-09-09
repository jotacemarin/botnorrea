"use strict";

const { MIX_PANEL_API_KEY } = process.env;

const Mixpanel = require("mixpanel");

const mixpanel = Mixpanel.init(MIX_PANEL_API_KEY);

const trackUser = (from) => {
  try {
    const { id, first_name, last_name, username, language_code } = from;
    const userId = String(id);
    const profile = {
      $distinct_id: userId,
      $username: username,
      $first_name: first_name,
      $last_name: last_name,
      telegram_id: userId,
      language_code,
    };

    mixpanel.people.set(userId, profile);
  } catch (error) {}
};

const trackEvent = (event, message) => {
  try {
    const { from } = message;
    const { id } = from;
    const userId = String(id);
    const eventValues = {
      $distinct_id: userId,
      telegram_id: userId,
    };

    mixpanel.track(event, eventValues);
  } catch (error) {}
};

const trackMessage = ({ message }) => {
  try {
    const { from, text } = message;
    const { id } = from;
    const userId = String(id);
    const amountWords = String(text).split(" ").length;

    trackUser(from);

    mixpanel.people.increment(userId, "messages");
    mixpanel.people.increment(userId, "words", amountWords);
  } catch (error) {}
};

const trackCommand = (event, context) => {
  try {
    const { message } = context;
    const { from } = message;
    trackUser(from);
    trackEvent(event, message);
  } catch (error) {}
};

module.exports = {
  trackMessage,
  trackCommand,
};
