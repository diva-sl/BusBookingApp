const config = {
  development: {
    API_BASE_URL: process.env.REACT_APP_LOCAL_API_BASE_URL,
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_PRODUCTION_API_BASE_URL,
  },
};

const env = process.env.NODE_ENV || "development";

export default config[env];
