export const configConfig = {
  client: process.env.DB_CLIENT || "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || "__APP_NAME__",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || ""
};

export default configConfig;
