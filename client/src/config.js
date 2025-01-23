const config = {
  API_BASE_URL:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PRODUCTION_API_BASE_URL
      : process.env.REACT_APP_LOCAL_API_BASE_URL,
};

export default config;
