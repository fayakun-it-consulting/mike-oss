/**
 * Integration example for Pandino OSGi components
 * This demonstrates how the CRUD components would be registered and used.
 */

import { Components } from "./crud-components";
import { DatabaseConfig } from "../lib/database-config";

// Example of how components would be registered in Pandino
export class ApplicationComponents {
  static registerComponents(): void {
    console.log('Registering Pandino OSGi components...');
    
    // Register all services with database configuration
    const config = DatabaseConfig.default();
    
    // These would be registered as OSGi services in a real Pandino environment
    const services = {
      projectService: Components.ProjectService(config),
      documentService: Components.DocumentService(config),
      userService: Components.UserService(config),
      chatService: Components.ChatService(config),
      workflowService: Components.WorkflowService(config),
      storageService: Components.StorageService(config)
    };
    
    console.log('Components registered:', Object.keys(services));
  }
}

// Example usage in a Pandino component lifecycle
export class ApplicationStartup {
  static async startup(): Promise<void> {
    console.log('Starting application with Pandino components...');
    
    try {
      // Initialize database
      const config = DatabaseConfig.default();
      const database = Components.ProjectService(config);
      
      // In a real environment, these would be injected by Pandino framework
      console.log('Application components initialized');
      
      // Example of CRUD operations
      const project = {
        name: 'Test Project',
        description: 'A test project',
        userId: 'user-123'
      };
      
      console.log('Starting CRUD operations...');
      
    } catch (error) {
      console.error('Startup failed:', error);
      throw error;
    }
  }
}

// Export for component registration
export const Startup = {
  register: ApplicationComponents.registerComponents,
  startup: ApplicationStartup.startup
};