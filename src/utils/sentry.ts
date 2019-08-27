import * as Sentry from "@sentry/node";

const register = () => {
  const { SENTRY_DSN } = process.env;
  Sentry.init({
    dsn: SENTRY_DSN
  });
  return Sentry;
};

const {
  captureMessage,
  captureException,
  captureEvent,
  configureScope
} = Sentry;

export default {
  captureEvent,
  captureException,
  captureMessage,
  configureScope,
  ...register()
};
