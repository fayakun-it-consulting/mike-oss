/**
 * Complete CRUD component implementations for Pandino OSGi
 * This provides all necessary backend components with database integration.
 */

import { DatabaseService } from "../lib/database-abstraction";
import { DatabaseConfig } from "../lib/database-config";
import { DatabaseInitializationService } from "../lib/database-initialization";

// Interface for all CRUD operations
export interface CrudOperations<T> {
  create(item: T): Promise<T>;
  read(id: string): Promise<T | null>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  list(): Promise<T[]>;
  search(query: string): Promise<T[]>;
}

// Base component for all services
export abstract class BaseService {
  protected database: DatabaseService;
  protected initialized: boolean = false;

  constructor(config: DatabaseConfig) {
    // In real Pandino environment, this would be injected
    this.database = DatabaseInitializationService.create(config).database;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    // Initialization would happen in Pandino component lifecycle
    this.initialized = true;
  }
}

// Project service implementation
export class ProjectService extends BaseService implements CrudOperations<any> {
  constructor(config: DatabaseConfig) {
    super(config);
  }

  async create(project: any): Promise<any> {
    const query = {
      sql: `INSERT INTO projects (id, user_id, name, description, created_at) 
            VALUES (?, ?, ?, ?, ?)`,
      params: [
        project.id || crypto.randomUUID(),
        project.userId,
        project.name,
        project.description,
        new Date().toISOString()
      ]
    };
    
    const result = await this.database.executeQuery(query);
    return { ...project, id: result.id };
  }

  async read(id: string): Promise<any | null> {
    const query = {
      sql: `SELECT * FROM projects WHERE id = ?`,
      params: [id]
    };
    
    const result = await this.database.executeQuery(query);
    return result.data || null;
  }

  async update(id: string, project: Partial<any>): Promise<any> {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (project.name) {
      updates.push(`name = ?`);
      params.push(project.name);
    }
    if (project.description) {
      updates.push(`description = ?`);
      params.push(project.description);
    }
    
    if (updates.length === 0) {
      throw new Error('No updates provided');
    }
    
    const query = {
      sql: `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`,
      params: [...params, id]
    };
    
    await this.database.executeQuery(query);
    return await this.read(id);
  }

  async delete(id: string): Promise<boolean> {
    const query = {
      sql: `DELETE FROM projects WHERE id = ?`,
      params: [id]
    };
    
    await this.database.executeQuery(query);
    return true;
  }

  async list(): Promise<any[]> {
    const query = {
      sql: `SELECT * FROM projects ORDER BY created_at DESC`,
      params: []
    };
    
    const result = await this.database.executeQuery(query);
    return result.data || [];
  }

  async search(query: string): Promise<any[]> {
    const searchQuery = {
      sql: `SELECT * FROM projects WHERE name LIKE ? OR description LIKE ?`,
      params: [`%${query}%`, `%${query}%`]
    };
    
    const result = await this.database.executeQuery(searchQuery);
    return result.data || [];
  }
}

// Document service implementation
export class DocumentService extends BaseService implements CrudOperations<any> {
  constructor(config: DatabaseConfig) {
    super(config);
  }

  async create(document: any): Promise<any> {
    const query = {
      sql: `INSERT INTO documents (id, project_id, folder_id, name, content, created_at) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      params: [
        document.id || crypto.randomUUID(),
        document.projectId,
        document.folderId,
        document.name,
        document.content,
        new Date().toISOString()
      ]
    };
    
    const result = await this.database.executeQuery(query);
    return { ...document, id: result.id };
  }

  async read(id: string): Promise<any | null> {
    const query = {
      sql: `SELECT * FROM documents WHERE id = ?`,
      params: [id]
    };
    
    const result = await this.database.executeQuery(query);
    return result.data || null;
  }

  async update(id: string, document: Partial<any>): Promise<any> {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (document.name) {
      updates.push(`name = ?`);
      params.push(document.name);
    }
    if (document.content) {
      updates.push(`content = ?`);
      params.push(document.content);
    }
    
    if (updates.length === 0) {
      throw new Error('No updates provided');
    }
    
    const query = {
      sql: `UPDATE documents SET ${updates.join(', ')} WHERE id = ?`,
      params: [...params, id]
    };
    
    await this.database.executeQuery(query);
    return await this.read(id);
  }

  async delete(id: string): Promise<boolean> {
    const query = {
      sql: `DELETE FROM documents WHERE id = ?`,
      params: [id]
    };
    
    await this.database.executeQuery(query);
    return true;
  }

  async list(): Promise<any[]> {
    const query = {
      sql: `SELECT * FROM documents ORDER BY created_at DESC`,
      params: []
    };
    
    const result = await this.database.executeQuery(query);
    return result.data || [];
  }

  async search(query: string): Promise<any[]> {
    const searchQuery = {
      sql: `SELECT * FROM documents WHERE name LIKE ? OR content LIKE ?`,
      params: [`%${query}%`, `%${query}%`]
    };
    
    const result = await this.database.executeQuery(searchQuery);
    return result.data || [];
  }
}

// UserService implementation
export class UserService extends BaseService {
  constructor(config: DatabaseConfig) {
    super(config);
  }

  async updateProfile(userId: string, profile: any): Promise<any> {
    const query = {
      sql: `UPDATE user_profiles SET 
            display_name = ?, 
            organisation = ?, 
            tier = ? 
            WHERE user_id = ?`,
      params: [
        profile.displayName,
        profile.organisation,
        profile.tier || 'Free',
        userId
      ]
    };
    
    await this.database.executeQuery(query);
    return await this.readProfile(userId);
  }

  async readProfile(userId: string): Promise<any | null> {
    const query = {
      sql: `SELECT * FROM user_profiles WHERE user_id = ?`,
      params: [userId]
    };
    
    const result = await this.database.executeQuery(query);
    return result.data || null;
  }

  async createProfile(profile: any): Promise<any> {
    const query = {
      sql: `INSERT INTO user_profiles (id, user_id, display_name, organisation, tier) 
            VALUES (?, ?, ?, ?, ?)`,
      params: [
        profile.id || crypto.randomUUID(),
        profile.userId,
        profile.displayName,
        profile.organisation,
        profile.tier || 'Free'
      ]
    };
    
    const result = await this.database.executeQuery(query);
    return { ...profile, id: result.id };
  }
}

// ChatService implementation
export class ChatService extends BaseService {
  constructor(config: DatabaseConfig) {
    super(config);
  }

  async createChat(chat: any): Promise<any> {
    const query = {
      sql: `INSERT INTO chats (id, user_id, title, created_at) 
            VALUES (?, ?, ?, ?)`,
      params: [
        chat.id || crypto.randomUUID(),
        chat.userId,
        chat.title,
        new Date().toISOString()
      ]
    };
    
    const result = await this.database.executeQuery(query);
    return { ...chat, id: result.id };
  }

  async readChat(id: string): Promise<any | null> {
    const query = {
      sql: `SELECT * FROM chats WHERE id = ?`,
      params: [id]
    };
    
    const result = await this.database.executeQuery(query);
    return result.data || null;
  }

  async listChats(userId: string): Promise<any[]> {
    const query = {
      sql: `SELECT * FROM chats WHERE user_id = ? ORDER BY created_at DESC`,
      params: [userId]
    };
    
    const result = await this.database.executeQuery(query);
    return result.data || [];
  }
}

// WorkflowService implementation
export class WorkflowService extends BaseService implements CrudOperations<any> {
  constructor(config: DatabaseConfig) {
    super(config);
  }

  async create(workflow: any): Promise<any> {
    const query = {
      sql: `INSERT INTO workflows (id, name, description, created_at) 
            VALUES (?, ?, ?, ?)`,
      params: [
        workflow.id || crypto.randomUUID(),
        workflow.name,
        workflow.description,
        new Date().toISOString()
      ]
    };
    
    const result = await this.database.executeQuery(query);
    return { ...workflow, id: result.id };
  }

  async read(id: string): Promise<any | null> {
    const query = {
      sql: `SELECT * FROM workflows WHERE id = ?`,
      params: [id]
    };
    
    const result = await this.database.executeQuery(query);
    return result.data || null;
  }

  async update(id: string, workflow: Partial<any>): Promise<any> {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (workflow.name) {
      updates.push(`name = ?`);
      params.push(workflow.name);
    }
    if (workflow.description) {
      updates.push(`description = ?`);
      params.push(workflow.description);
    }
    
    if (updates.length === 0) {
      throw new Error('No updates provided');
    }
    
    const query = {
      sql: `UPDATE workflows SET ${updates.join(', ')} WHERE id = ?`,
      params: [...params, id]
    };
    
    await this.database.executeQuery(query);
    return await this.read(id);
  }

  async delete(id: string): Promise<boolean> {
    const query = {
      sql: `DELETE FROM workflows WHERE id = ?`,
      params: [id]
    };
    
    await this.database.executeQuery(query);
    return true;
  }

  async list(): Promise<any[]> {
    const query = {
      sql: `SELECT * FROM workflows ORDER BY created_at DESC`,
      params: []
    };
    
    const result = await this.database.executeQuery(query);
    return result.data || [];
  }

  async search(query: string): Promise<any[]> {
    const searchQuery = {
      sql: `SELECT * FROM workflows WHERE name LIKE ? OR description LIKE ?`,
      params: [`%${query}%`, `%${query}%`]
    };
    
    const result = await this.database.executeQuery(searchQuery);
    return result.data || [];
  }
}

// StorageService implementation
export class StorageService extends BaseService {
  constructor(config: DatabaseConfig) {
    super(config);
  }

  async upload(file: any): Promise<any> {
    const query = {
      sql: `INSERT INTO storage (id, filename, path, size, created_at) 
            VALUES (?, ?, ?, ?, ?)`,
      params: [
        file.id || crypto.randomUUID(),
        file.filename,
        file.path,
        file.size,
        new Date().toISOString()
      ]
    };
    
    const result = await this.database.executeQuery(query);
    return { ...file, id: result.id };
  }

  async deleteFile(id: string): Promise<boolean> {
    const query = {
      sql: `DELETE FROM storage WHERE id = ?`,
      params: [id]
    };
    
    await this.database.executeQuery(query);
    return true;
  }

  async getFile(id: string): Promise<any | null> {
    const query = {
      sql: `SELECT * FROM storage WHERE id = ?`,
      params: [id]
    };
    
    const result = await this.database.executeQuery(query);
    return result.data || null;
  }
}

// Component factories for Pandino
export const Components = {
  ProjectService: (config: DatabaseConfig) => new ProjectService(config),
  DocumentService: (config: DatabaseConfig) => new DocumentService(config),
  UserService: (config: DatabaseConfig) => new UserService(config),
  ChatService: (config: DatabaseConfig) => new ChatService(config),
  WorkflowService: (config: DatabaseConfig) => new WorkflowService(config),
  StorageService: (config: DatabaseConfig) => new StorageService(config)
};

// Export for easy component registration in Pandino
export const Services = {
  Project: Components.ProjectService,
  Document: Components.DocumentService,
  User: Components.UserService,
  Chat: Components.ChatService,
  Workflow: Components.WorkflowService,
  Storage: Components.StorageService
};