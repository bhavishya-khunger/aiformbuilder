import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 20
    },

    email: {
      type: String,
      required: true,
      trim: true
    },

    passwordHash: {
      type: String,
      select: false
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free"
    },

    credits: {
      type: Number,
      default: 5
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    lastLoginAt: Date,

    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

/* ---------------- INDEXES ---------------- */

// ✅ Single source of truth
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ plan: 1 });

/* ---------------- METHODS ---------------- */

UserSchema.methods.hasCredits = function (amount = 1) {
  return this.credits >= amount;
};

UserSchema.methods.consumeCredits = function (amount = 1) {
  if (this.credits < amount) return false;
  this.credits -= amount;
  return true;
};

const User = mongoose.model("User", UserSchema);

export default User;
