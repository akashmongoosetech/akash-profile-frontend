import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2, Code, Database, Shield, Zap, Server, GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';

const ModernBackendDevelopment: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-8">
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
              Backend
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              March 10, 2024
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              6 min read
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
            Modern Backend Development with Node.js and TypeScript
          </h1>
          
          <p className="text-xl text-gray-400 leading-relaxed">
            Explore the benefits of using TypeScript in Node.js applications, including type safety, better tooling, and improved developer experience.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Backend Development"
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </motion.div>

        {/* Share Button */}
        <motion.div variants={itemVariants} className="mb-12">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:bg-white/20 transition-all duration-200">
            <Share2 className="w-4 h-4" />
            Share Article
          </button>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants} className="prose prose-invert prose-lg max-w-none">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Server className="w-6 h-6 text-green-400" />
              Why TypeScript for Backend Development?
            </h2>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              TypeScript has revolutionized backend development by bringing static typing to JavaScript. When combined with Node.js, it creates a powerful, type-safe environment that significantly improves code quality and developer productivity.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  Type Safety
                </h4>
                <p className="text-gray-400 text-sm">
                  Catch errors at compile time rather than runtime, reducing bugs and improving code reliability.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4 text-green-400" />
                  Better Tooling
                </h4>
                <p className="text-gray-400 text-sm">
                  Enhanced IDE support with autocomplete, refactoring, and intelligent error detection.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Improved DX
                </h4>
                <p className="text-gray-400 text-sm">
                  Better developer experience with clearer code documentation and easier maintenance.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  Refactoring Safety
                </h4>
                <p className="text-gray-400 text-sm">
                  Safe refactoring with confidence that type changes are caught across the codebase.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Setting Up a TypeScript Node.js Project</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Let's walk through setting up a modern TypeScript Node.js project with best practices:
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">1. Project Initialization</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`# Initialize project
npm init -y

# Install TypeScript and essential dependencies
npm install typescript @types/node ts-node nodemon
npm install --save-dev @types/express

# Initialize TypeScript configuration
npx tsc --init`}
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">2. TypeScript Configuration (tsconfig.json)</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Building Type-Safe APIs</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              TypeScript enables us to create robust, type-safe APIs. Here's how to structure your backend:
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Type Definitions</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`// types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}`}
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Service Layer with TypeScript</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`// services/userService.ts
import { User, CreateUserRequest, UpdateUserRequest } from '../types/user';

export class UserService {
  async createUser(userData: CreateUserRequest): Promise<User> {
    // Implementation with full type safety
    const user: User = {
      id: generateId(),
      email: userData.email,
      name: userData.name,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return user;
  }

  async updateUser(id: string, updates: UpdateUserRequest): Promise<User | null> {
    // Type-safe updates
    return null;
  }
}`}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              Database Integration with TypeScript
            </h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Modern database libraries like Prisma and TypeORM provide excellent TypeScript support:
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Prisma Schema Example</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  posts Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Error Handling with TypeScript</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              TypeScript enables better error handling with custom error types:
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Custom Error Classes</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`// errors/AppError.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, \`\${resource} not found\`);
  }
}`}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Testing with TypeScript</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              TypeScript enhances testing by providing better type checking and IDE support:
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Jest Test Example</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`// __tests__/userService.test.ts
import { UserService } from '../services/userService';
import { CreateUserRequest } from '../types/user';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it('should create a user with valid data', async () => {
    const userData: CreateUserRequest = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123'
    };

    const user = await userService.createUser(userData);
    
    expect(user.email).toBe(userData.email);
    expect(user.name).toBe(userData.name);
    expect(user.id).toBeDefined();
  });
});`}
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
              <h4 className="font-bold text-green-400 mb-3">🚀 Performance Benefits</h4>
              <p className="text-gray-300">
                TypeScript applications often perform better in production due to better optimization opportunities and reduced runtime type checking.
              </p>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Best Practices</h3>

            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li><strong>Use strict mode:</strong> Enable all strict TypeScript compiler options</li>
              <li><strong>Define interfaces:</strong> Create clear interfaces for all data structures</li>
              <li><strong>Use generics:</strong> Leverage generics for reusable, type-safe code</li>
              <li><strong>Implement proper error handling:</strong> Use custom error classes with TypeScript</li>
              <li><strong>Write comprehensive tests:</strong> Take advantage of TypeScript's type checking in tests</li>
            </ul>

            <h3 className="text-xl font-bold text-white mb-4">Conclusion</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              TypeScript has become an essential tool for modern backend development with Node.js. Its type safety, better tooling, and improved developer experience make it an excellent choice for building robust, maintainable applications.
            </p>

            <p className="text-gray-300 leading-relaxed">
              By adopting TypeScript in your Node.js projects, you'll benefit from fewer runtime errors, better code documentation, and a more enjoyable development experience. The initial learning curve is well worth the long-term benefits.
            </p>
          </div>
        </motion.div>

        {/* Author Info */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <Server className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">Sarah Chen</h3>
                <p className="text-gray-400 text-sm">Backend Engineer & DevOps Specialist</p>
                <p className="text-gray-500 text-sm">Experienced in building scalable backend systems and passionate about TypeScript adoption in modern development.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ModernBackendDevelopment; 