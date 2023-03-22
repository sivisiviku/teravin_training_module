import { Connection, ConnectionManager, ConnectionOptions} from "typeorm";
import { MigrationExecutor } from "typeorm/migration/MigrationExecutor";

export class AppTypeOrm {
    public static async getConnectionManager(options: ConnectionOptions): Promise<ConnectionManager> {
        const connectionManager = new ConnectionManager();
        const connection =  connectionManager.create(options);
        await connection.connect();
        return connectionManager;
    }

    constructor(private connectionManager: ConnectionManager) {
    }

    public getConnection(): Connection {
        return this.connectionManager.get();
    }
    
    public async runMigration(): Promise<any> {
        const migrationExecutor = new MigrationExecutor(this.getConnection());
        // return migrationExecutor.undoLastMigration();
        return migrationExecutor.executePendingMigrations();
    }
}
