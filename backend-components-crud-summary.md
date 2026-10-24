# Backend Components CRUD Operations Summary

## Overview
This document summarizes all backend components and their associated CRUD operations for the Mike project, identifying all components that must be properly connected with database operations for complete system coverage.

## Core Components with CRUD Operations

### 1. Projects Management
**Routes:** `/projects` and `/projects/:projectId`
- **GET** `/projects` - Get projects list
- **GET** `/projects/:projectId` - Get specific project
- **POST** `/projects` - Create new project
- **DELETE** `/projects/:projectId` - Delete project
- **GET** `/projects/:projectId/people` - Get project members
- **GET** `/projects/:projectId/documents` - Get project documents
- **POST** `/projects/:projectId/documents` - Create document in project
- **POST** `/projects/:projectId/documents/:documentId` - Assign/copy document to project

### 2. Documents Management
**Routes:** `/single-documents` and `/single-documents/:documentId`
- **GET** `/single-documents` - Get documents list
- **POST** `/single-documents` - Create new document
- **GET** `/single-documents/:documentId` - Get specific document
- **DELETE** `/single-documents/:documentId` - Delete document
- **GET** `/single-documents/:documentId/display` - Get document display
- **GET** `/single-documents/:documentId/url` - Get document URL
- **GET** `/single-documents/:documentId/docx` - Get document as DOCX
- **GET** `/single-documents/:documentId/versions` - Get document versions
- **POST** `/single-documents/:documentId/versions` - Create document version

### 3. User Profile Management
**Routes:** `/user`
- **POST** `/user/profile` - Update user profile
- **GET** `/user/profile` - Get user profile
- **GET** `/user/settings` - Get user settings
- **POST** `/user/settings` - Update user settings

### 4. Chat System
**Routes:** `/chat` and `/projects/:projectId/chats`
- **GET** `/chat` - Get chat list
- **GET** `/projects/:projectId/chats` - Get project chats
- **POST** `/chat` - Create chat message
- **GET** `/chat/:chatId` - Get specific chat

### 5. Workflows Management
**Routes:** `/workflows`
- **GET** `/workflows` - Get workflows list
- **POST** `/workflows` - Create workflow
- **GET** `/workflows/:workflowId` - Get specific workflow
- **PUT** `/workflows/:workflowId` - Update workflow
- **DELETE** `/workflows/:workflowId` - Delete workflow

### 6. Tabular Reviews
**Routes:** `/tabular-review`
- **GET** `/tabular-review` - Get tabular reviews
- **POST** `/tabular-review` - Create tabular review
- **GET** `/tabular-review/:reviewId` - Get specific review
- **PUT** `/tabular-review/:reviewId` - Update review
- **DELETE** `/tabular-review/:reviewId` - Delete review

### 7. Downloads
**Routes:** `/download`
- **GET** `/download/:token` - Download file by token

### 8. Storage Operations
**Routes:** `/storage`
- **POST** `/storage/upload` - Upload file
- **DELETE** `/storage/delete` - Delete file
- **GET** `/storage/download` - Download file

### 9. Document Versions
**Routes:** `/versions`
- **GET** `/versions` - Get versions list
- **POST** `/versions` - Create version
- **GET** `/versions/:versionId` - Get specific version
- **DELETE** `/versions/:versionId` - Delete version

### 10. Chat Tools
**Routes:** `/chat-tools`
- **GET** `/chat-tools` - Get chat tools
- **POST** `/chat-tools` - Create chat tool
- **GET** `/chat-tools/:toolId` - Get specific tool
- **PUT** `/chat-tools/:toolId` - Update tool
- **DELETE** `/chat-tools/:toolId` - Delete tool

## Database Operations by Component

### CRUD Operations Matrix:

| Component | CREATE | READ | UPDATE | DELETE |
|-----------|--------|------|--------|--------|
| Projects | ✅ | ✅ | ❌ | ✅ |
| Documents | ✅ | ✅ | ❌ | ✅ |
| Users | ❌ | ✅ | ✅ | ❌ |
| Chats | ❌ | ✅ | ❌ | ❌ |
| Workflows | ✅ | ✅ | ✅ | ✅ |
| Tabular Reviews | ✅ | ✅ | ✅ | ✅ |
| Storage | ✅ | ✅ | ❌ | ✅ |
| Versions | ✅ | ✅ | ❌ | ✅ |
| Chat Tools | ✅ | ✅ | ✅ | ✅ |

## Pandino OSGi Integration Requirements

### Components to Implement:

1. **ProjectService** - Project CRUD operations
2. **DocumentService** - Document CRUD operations  
3. **UserService** - User profile operations
4. **ChatService** - Chat conversation management
5. **WorkflowService** - Workflow lifecycle operations
6. **ReviewService** - Tabular review management
7. **StorageService** - File storage operations
8. **VersionService** - Document version control
9. **ToolService** - Chat tool management

### Database Abstraction Requirements:

1. **DatabaseService** - Core database operations
2. **DatabaseContext** - Transaction management  
3. **DatabaseInitialization** - Schema setup
4. **DatabaseFactory** - Service creation factory

### Migration Path:

1. **Phase 1**: Implement core DatabaseService abstractions
2. **Phase 2**: Add all component services with CRUD methods
3. **Phase 3**: Integrate with existing routes
4. **Phase 4**: Add transaction support
5. **Phase 5**: Add schema validation

## System Integration Points

### Frontend Dependencies:
- Project listing and creation
- Document management
- User profile updates
- Chat interactions
- Workflow execution

### Backend Dependencies:
- Supabase authentication
- PostgreSQL database operations
- File storage services
- Document conversion tools
- LLM integration

## Testing Requirements

### Unit Tests:
- Database connection tests
- CRUD operation tests
- Transaction behavior tests
- Schema validation tests

### Integration Tests:
- Component service initialization
- Database transaction handling
- Route handler integration
- Error response handling

## Migration Status

### Completed:
- Database abstraction layer
- SQLite/PostgreSQL support
- Component factory patterns
- Schema definition
- Initialization system

### Pending:
- Individual service implementations
- Route integration
- Transaction management
- Testing framework