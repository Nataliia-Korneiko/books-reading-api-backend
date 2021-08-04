const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { ExtractJwt, Strategy } = require('passport-jwt');
const { userService: services } = require('../services');
const keys = require('./config-keys');
const { User } = require('../models');
require('dotenv').config();

const { JWT_SECRET_KEY, BASE_URL_BACKEND } = process.env;

const settings = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET_KEY,
};

const params = {
  clientID: keys.google.googleClientId,
  clientSecret: keys.google.googleClientKey,
  callbackURL: `${BASE_URL_BACKEND}/api/auth/google/redirect`,
};

passport.use(
  'jwt',
  new Strategy(settings, async (payload, done) => {
    try {
      const user = await services.getUserById(payload.id);

      if (!user) {
        return done(new Error('User not found'));
      }

      if (!user.token) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      done(new Error(error.message));
    }
  })
);

passport.use(
  'google',
  new GoogleStrategy(
    params,
    async (accessToken, refreshToken, profile, done) => {
      try {
        const newUser = {
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value.replace(/_normal/, ''),
          googleId: profile.id,
        };

        User.findOne({ googleId: profile.id }).then(async (currentUser) => {
          if (currentUser) {
            const id = currentUser._id;
            const payload = { id };
            const token = jwt.sign(payload, JWT_SECRET_KEY, {
              expiresIn: '16h',
            });

            await services.updateToken(id, token);

            currentUser.token = token;
            done(null, currentUser);
          } else {
            const result = await new User({
              ...newUser,
            }).save();

            const id = result._id;
            const payload = { id };
            const token = jwt.sign(payload, JWT_SECRET_KEY, {
              expiresIn: '16h',
            });

            await services.updateToken(id, token);

            result.token = token;
            done(null, result);
          }
        });
      } catch (error) {
        done(new Error(error.message));
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
