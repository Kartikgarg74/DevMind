# DevMind Development Step-Wise Prompts
Version: 2025-07-26

## Phase 1: Core Infrastructure

### 1. Project Initialization
```prompt
Initialize DevMind project structure with following requirements:

CONTEXT:
- Monorepo using pnpm workspaces
- TypeScript strict mode
- VS Code extension framework
- AI integration preparation

REQUIRED SETUP:
1. Directory structure
2. Base configuration files
3. Initial dependencies
4. Build pipeline

Generate:
1. Package structure
2. tsconfig files
3. Build scripts
4. CI/CD workflows

VALIDATION:
- TypeScript compilation
- Build process
- Dependency resolution
- VS Code extension loading
```

### 2. Context Engine Foundation
```prompt
Create the core context engine with the following components:

COMPONENTS:
1. File System Scanner
   - Directory traversal
   - File type detection
   - Ignore patterns
   - Performance optimization

2. Parser System
   - TypeScript AST parsing
   - Symbol extraction
   - Type inference
   - Relationship mapping

3. Context Storage
   - In-memory cache
   - Persistent storage
   - Vector database setup
   - Update mechanisms

4. Custom Context Handler
   - User input processing
   - Pattern recognition
   - Rule enforcement
   - Context merging

REQUIREMENTS:
- Memory efficient
- Background processing
- Cancelable operations
- Progress reporting

IMPLEMENTATION QUESTIONS:
1. Which AST parser should we use?
   Options:
   - TypeScript Compiler API
   - Babel Parser
   - Custom lightweight parser

2. Vector storage solution?
   Options:
   - FAISS
   - Annoy
   - Custom solution

Provide implementation plan with consideration for each component.
```

### 3. AI Layer Integration
```prompt
Implement AI integration layer with multiple providers:

PROVIDERS:
1. Groq API Integration
   - Authentication
   - Request handling
   - Response processing
   - Error management

2. HuggingFace Integration
   - Model selection
   - API communication
   - Response formatting
   - Caching strategy

3. OpenRouter Integration
   - Provider selection
   - Request routing
   - Response normalization
   - Fallback handling

REQUIREMENTS:
- Type safety
- Error handling
- Rate limiting
- Retry logic
- Response caching

IMPLEMENTATION DETAILS NEEDED:
1. Authentication mechanism
2. Request queuing strategy
3. Cache invalidation rules
4. Error recovery process

Generate interface definitions and base implementations.
```

## Phase 2: Feature Implementation

### 4. Context-Aware Code Analysis
```prompt
Implement code analysis system with context awareness:

FEATURES:
1. Syntax Analysis
   - Error detection
   - Style checking
   - Pattern matching
   - Context validation

2. Semantic Analysis
   - Type checking
   - Control flow
   - Data flow
   - Dead code detection

3. Context Integration
   - Project patterns
   - Team conventions
   - Historical data
   - Related files

IMPLEMENTATION REQUIREMENTS:
- Performance optimization
- Memory efficiency
- Background processing
- Progressive results

DECISION POINTS:
1. Analysis granularity
2. Update frequency
3. Result caching
4. Context weighting

Provide detailed implementation approach.
```

### 5. Smart Code Generation
```prompt
Create context-aware code generation system:

COMPONENTS:
1. Template Engine
   - Pattern extraction
   - Template creation
   - Context injection
   - Output formatting

2. AI Generation
   - Prompt construction
   - Context inclusion
   - Response processing
   - Code formatting

3. Hybrid System
   - Mode selection
   - Integration logic
   - Quality assurance
   - Performance optimization

REQUIREMENTS:
- Type safety
- Style consistency
- Performance
- Error handling

DECISION NEEDED:
1. Generation strategy
2. Context inclusion depth
3. Quality metrics
4. Review process

Detail the implementation approach with examples.
```

### 6. Context Management UI
```prompt
Design and implement context management interface:

COMPONENTS:
1. Context Explorer
   - Tree view
   - Quick actions
   - Search/filter
   - Context editing

2. Settings Panel
   - Provider configuration
   - Context rules
   - Performance settings
   - Custom patterns

3. Status Indicators
   - Context health
   - AI status
   - Processing state
   - Error conditions

REQUIREMENTS:
- Responsive UI
- Clear visualization
- Easy navigation
- Quick actions

IMPLEMENTATION QUESTIONS:
1. View organization
2. Update frequency
3. Interaction patterns
4. Performance considerations

Provide detailed UI/UX specifications.
```

## Phase 3: Testing & Documentation

### 7. Test Suite Implementation
```prompt
Create comprehensive test suite:

COMPONENTS:
1. Unit Tests
   - Context engine
   - AI integration
   - Code generation
   - UI components

2. Integration Tests
   - End-to-end flows
   - Performance tests
   - Stress tests
   - Edge cases

3. Documentation Tests
   - API documentation
   - Usage examples
   - Configuration guides
   - Troubleshooting

REQUIREMENTS:
- Coverage > 80%
- Performance benchmarks
- Error scenarios
- Edge cases

Generate test plan and initial implementation.
```

### 8. Documentation Generation
```prompt
Create documentation system:

COMPONENTS:
1. API Documentation
   - Public APIs
   - Type definitions
   - Usage examples
   - Best practices

2. User Guide
   - Installation
   - Configuration
   - Features
   - Troubleshooting

3. Developer Guide
   - Architecture
   - Contributing
   - Building
   - Testing

REQUIREMENTS:
- Clear structure
- Code examples
- Diagrams
- Search functionality

Generate documentation outline and templates.
```

## Help & Decision Prompts

### 9. Implementation Help
```prompt
IMPLEMENTATION ASSISTANCE:
1. Current task:
   - Component:
   - Feature:
   - Progress:
   - Blockers:

2. Context:
   - Related files:
   - Dependencies:
   - Constraints:
   - Requirements:

3. Attempted Solutions:
   - Approach 1:
   - Approach 2:
   - Results:
   - Issues:

4. Specific Questions:
   - Question 1:
   - Question 2:

Provide detailed technical guidance.
```

### 10. Architecture Decisions
```prompt
ARCHITECTURE DECISION:
1. Decision Point:
   - Component:
   - Impact:
   - Constraints:
   - Options:

2. Context:
   - Current architecture:
   - Requirements:
   - Limitations:
   - Future considerations:

3. Options Analysis:
   - Option 1:
     * Pros:
     * Cons:
   - Option 2:
     * Pros:
     * Cons:

4. Decision Criteria:
   - Performance:
   - Maintainability:
   - Scalability:
   - Complexity:

Provide detailed analysis and recommendation.
```
```

These enhanced prompts provide:
1. More structured approach to development
2. Detailed requirements for each component
3. Clear decision points
4. Implementation guidance
5. Testing and documentation focus

Would you like me to:
1. Add more specific prompts for any component?
2. Expand any section with more technical details?
3. Add example responses for specific prompts?