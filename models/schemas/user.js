const bcrypt = require('bcryptjs');
const { Schema, SchemaTypes } = require('mongoose');

const SALT_FACTOR = 10;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      default: 'Guest',
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Email is required'],
      validate(value) {
        const re = /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/;
        return re.test(String(value).toLowerCase());
      },
    },
    password: {
      type: String,
      minLength: 8,
      maxLength: 20,
    },
    avatar: {
      type: String,
    },
    googleId: {
      type: String,
    },
    books: [
      {
        type: SchemaTypes.ObjectId,
        ref: 'book',
      },
    ],
    training: {
      type: SchemaTypes.ObjectId,
      ref: 'training',
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(SALT_FACTOR);
  this.password = await bcrypt.hash(this.password, salt, null);
  next();
});

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = userSchema;
