import "dotenv/config";

const JWT_SECRET =
  process.env.SECRET_KEY || "79db79589ff4fe0c96c3318469ad6b4f0bf0fae05768c4ae679f090c72e4c12a";

const devConfig = {
  MONGO_URL: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  JWT_SECRET,
};

const testConfig = {
  MONGO_URL: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  JWT_SECRET,
};

const prodConfig = {
  MONGO_URL: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  JWT_SECRET,
};

const defaultConfig = {
  PORT: process.env.PORT || 5000,
};

function envConfig(env) {
  switch (env) {
    case "development":
      return devConfig;
    case "test":
      return testConfig;
    default:
      return prodConfig;
  }
}

export default {
  ...defaultConfig,
  ...envConfig(process.env.NODE_ENV),
};
