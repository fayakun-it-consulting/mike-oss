/**
 * Database abstraction layer for Pandino OSGi components
 * This provides a consistent interface for switching between
 * SQLite and PostgreSQL databases in a component-based architecture.
 */

// Database operation types
export interface DatabaseQuery {
  sql: string;
  params?: any[];
  type?: 'select' | 'insert' | 'update' | 'delete';
}

export interface DatabaseTransaction {
  operations: DatabaseQuery[];
  isolationLevel?: 'read-committed' | 'repeatable-read' | 'serializable';
}

// Common database service interface
export interface DatabaseService {
  /**
   * Execute a single query
   */
  executeQuery(query: DatabaseQuery): Promise<any>;
  
  /**
   * Execute multiple queries in a transaction
   */
  executeTransaction(transaction: DatabaseTransaction): Promise<boolean>;
  
  /**
   * Begin a transaction
   */
  beginTransaction(): Promise<void>;
  
  /**
   * Commit a transaction
   */
  commit(): Promise<void>;
  
  /**
   * Rollback a transaction
   */
  rollback(): Promise<void>;
  
  /**
   * Get database metadata
   */
  getMetadata(): Promise<{
    type: string;
    version: string;
    connected: boolean;
  }>;
}

// Configuration interface
export interface DatabaseConfig {
  type: 'sqlite' | 'postgresql';
  url?: string;
  connection?: any;
  options?: {
    [key: string]: any;
  };
}

// Factory for creating database services
export class DatabaseServiceFactory {
  static create(config: DatabaseConfig): DatabaseService {
    if (config.type === 'sqlite') {
      return new SqliteDatabaseService(config);
    } else if (config.type === 'postgresql') {
      return new PostgreSqlDatabaseService(config);
    }
    throw new Error(`Unsupported database type: ${config.type}`);
  }
  
  static createFromEnvironment(): DatabaseService {
    const type = process.env.DB_TYPE as 'sqlite' | 'postgresql' || 'sqlite'; // Changed default to SQLite
    const url = process.env.DATABASE_URL;
    
    return this.create({
      type,
      url
    });
  }
}

// SQLite implementation (placeholder for actual implementation)
class SqliteDatabaseService implements DatabaseService {
  private config: DatabaseConfig;
  private connection: any;
  
  constructor(config: DatabaseConfig) {
    this.config = config;
  }
  
  async executeQuery(query: DatabaseQuery): Promise<any> {
    // Implementation would be specific to SQLite
    console.log(`SQLite Query: ${query.sql}`);
    return { success: true };
  }
  
  async executeTransaction(transaction: DatabaseTransaction): Promise<boolean> {
    // Implementation would be specific to SQLite transactions
    console.log(`SQLite Transaction with ${transaction.operations.length} operations`);
    return true;
  }
  
  async beginTransaction(): Promise<void> {
    // Implementation would be specific to SQLite
    console.log('Starting SQLite transaction');
  }
  
  async commit(): Promise<void> {
    // Implementation would be specific to SQLite
    console.log('Committing SQLite transaction');
  }
  
  async rollback(): Promise<void> {
    // Implementation would be specific to SQLite
    console.log('Rolling back SQLite transaction');
  }
  
  async getMetadata(): Promise<{ type: string; version: string; connected: boolean }> {
    return {
      type: 'sqlite',
      version: '3.39.0',
      connected: true
    };
  }
}

// PostgreSQL implementation (placeholder for actual implementation)
class PostgreSqlDatabaseService implements DatabaseService {
  private config: DatabaseConfig;
  private connection: any;
  
  constructor(config: DatabaseConfig) {
    this.config = config;
  }
  
  async executeQuery(query: DatabaseQuery): Promise<any> {
    // Implementation would be specific to PostgreSQL
    console.log(`PostgreSQL Query: ${query.sql}`);
    return { success: true };
  }
  
  async executeTransaction(transaction: DatabaseTransaction): Promise<boolean> {
    // Implementation would be specific to PostgreSQL transactions
    console.log(`PostgreSQL Transaction with ${transaction.operations.length} operations`);
    return true;
  }
  
  async beginTransaction(): Promise<void> {
    // Implementation would be specific to PostgreSQL
    console.log('Starting PostgreSQL transaction');
  }
  
  async commit(): Promise<void> {
    // Implementation would be specific to PostgreSQL
    console.log('Committing PostgreSQL transaction');
  }
  
  async rollback(): Promise<void> {
    // Implementation would be specific to PostgreSQL
    console.log('Rolling back PostgreSQL transaction');
  }
  
  async getMetadata(): Promise<{ type: string; version: string; connected: boolean }> {
    return {
      type: 'postgresql',
      version: '15.0',
      connected: true
    };
  }
}

// Database context for Pandino components
export class DatabaseContext {
  private service: DatabaseService;
  
  constructor(service: DatabaseService) {
    this.service = service;
  }
  
  async execute(query: DatabaseQuery): Promise<any> {
    return await this.service.executeQuery(query);
  }
  
  async transaction(operations: DatabaseQuery[]): Promise<boolean> {
    return await this.service.executeTransaction({
      operations,
      isolationLevel: 'read-committed'
    });
  }
  
  async withTransaction(operations: DatabaseQuery[]): Promise<boolean> {
    try {
      await this.service.beginTransaction();
      const result = await this.service.executeTransaction({
        operations,
        isolationLevel: 'read-committed'
      });
      await this.service.commit();
      return result;
    } catch (error) {
      await this.service.rollback();
      throw error;
    }
  }
}

// Export factory for easy consumption in Pandino components
export const Database = {
  createService: (config: DatabaseConfig) => DatabaseServiceFactory.create(config),
  createFromEnvironment: () => DatabaseServiceFactory.createFromEnvironment(),
  createContext: (service: DatabaseService) => new DatabaseContext(service)
};