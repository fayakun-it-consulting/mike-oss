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
  createContext: (service: DatabaseService) => new DatabaseContext(service)
};