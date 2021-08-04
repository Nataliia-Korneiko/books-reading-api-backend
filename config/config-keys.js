require('dotenv').config();

const { DB_HOST, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, COOKIE_KEY } =
  process.env;

const keys = {
  mongodb: {
    db: DB_HOST,
  },
  google: {
    googleClientId: GOOGLE_CLIENT_ID,
    googleClientKey: GOOGLE_CLIENT_SECRET,
  },
  session: {
    cookieKey: COOKIE_KEY,
  },
};

module.exports = keys;
