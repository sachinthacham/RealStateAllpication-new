export const env = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
    mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/realestate",
    jwtSecret: process.env.JWT_SECRET || "change_this",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    saltRounds: Number(process.env.SALT_ROUNDS || 10),
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  };
  