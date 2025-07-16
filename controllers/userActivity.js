import UserActivity from "../models/userActivity.js";

export const logUserActivity = async ({
  userId,
  action,
  collection,
  metadata = {},
}) => {
  try {
    await UserActivity.create({
      user: userId,
      action,
      collection,
      metadata,
    });
  } catch (err) {
    console.error("Failed to log user activity:", err.message);
  }
};
