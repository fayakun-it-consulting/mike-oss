/**
 * Example Pandino OSGi component using the database abstraction
 * This demonstrates how components would integrate with the database layer.
 */

import { DatabaseService } from "../lib/database-service-factory";
import { Database } from "../lib/database-abstraction";
import { DatabaseConfig } from "../lib/database-config";

// Example component that uses the database abstraction
export class ProjectService {
  private database: any; // This would be injected in real Pandino
  
  constructor(config: DatabaseConfig) {
    // In a real Pandino environment, this would be injected automatically
    this.database = DatabaseService.create(config);
  }
  
  /**
   * Create a project - example of database usage in a Pandino component
   */
  async createProject(projectData: any): Promise<any> {
    const query = {
      sql: `INSERT INTO projects (name, user_id, created_at) 
            VALUES (?, ?, ?)`,
      params: [projectData.name, projectData.userId, new Date().toISOString()]
    };
    
    try {
      const result = await this.database.executeQuery(query);
      console.log('Project created successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  }
  
  /**
   * Get projects for a user - example of transaction usage
   */
  async getProjects(userId: string): Promise<any> {
    const queries = [
      {
        sql: `SELECT * FROM projects WHERE user_id = ?`,
        params: [userId]
      }
    ];
    
    try {
      const result = await this.database.executeTransaction({
        operations: queries
      });
      console.log('Projects retrieved successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to retrieve projects:', error);
      throw error;
    }
  }
  
  /**
   * Example usage with context
   */
  async useDatabaseContext(): Promise<void> {
    // Create a database context
    const context = Database.createContext(this.database);
    
    const query = {
      sql: `SELECT COUNT(*) as count FROM projects WHERE user_id = ?`,
      params: ['user-123']
    };
    
    try {
      const result = await context.execute(query);
      console.log('Query result:', result);
    } catch (error) {
      console.error('Query failed:', error);
    }
  }
}

// Example of component registration (would be done by Pandino framework)
export const ProjectServiceComponent = {
  create: (config: DatabaseConfig) => new ProjectService(config),
  name: 'ProjectService'
};

// Export for easy component registration in Pandino
export const Components = {
  ProjectService: ProjectServiceComponent
};