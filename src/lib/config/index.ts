export class Config {
    public dbDatabase = process.env.DB_DATABASE || "teravin_order_transaction";
    public dbHost =  process.env.DB_HOST || "127.0.0.1";
    public dbPassword =  process.env.DB_PASSWORD || "";
    public dbType = "mysql" as const;
    public dbUsername =  process.env.DB_USERNAME || "root";
    public dbSchema =  process.env.DB_SCHEMA || "dbo";
    public dbLogging = process.env.NODE_ENV === "development";
    public dbMaxPool = Number.isNaN(parseInt(process.env.DB_MAX_POOL || "50", 10)) ? 50 : parseInt(process.env.DB_MAX_POOL || "50", 10);
    public logger = process.env.LOGGER !== "FALSE";
    public port = "3000"; // process.env.NODE_PORT || "3004"; // temporary change from 3000 to 80
    // public redisHost = process.env.REDIS_HOST; // temporary
    // public redisPassword = process.env.REDIS_PASSWORD; // temporary
}
