import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2, Ship, Layers, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const DockerKubernetesDeployment: React.FC = () => {
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
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
              DevOps
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              March 5, 2024
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              12 min read
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
            Deploying Applications with Docker and Kubernetes
          </h1>
          
          <p className="text-xl text-gray-400 leading-relaxed">
            A comprehensive guide to containerizing applications and orchestrating them with Kubernetes for production-ready deployments.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Docker and Kubernetes"
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
              <Ship className="w-6 h-6 text-blue-400" />
              Understanding Containerization
            </h2>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Containerization has revolutionized how we deploy and manage applications. Docker provides a standardized way to package applications with their dependencies, while Kubernetes orchestrates these containers at scale.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Ship className="w-4 h-4 text-blue-400" />
                  Docker Benefits
                </h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Consistent environments</li>
                  <li>• Isolated dependencies</li>
                  <li>• Easy deployment</li>
                  <li>• Version control</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-green-400" />
                  Kubernetes Benefits
                </h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Auto-scaling</li>
                  <li>• Load balancing</li>
                  <li>• Self-healing</li>
                  <li>• Rolling updates</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Creating a Dockerfile</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              A well-optimized Dockerfile is crucial for efficient container builds and deployments:
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Multi-Stage Dockerfile for Node.js</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000
CMD ["npm", "start"]`}
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Docker Compose for Development</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:`}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Kubernetes Deployment</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Kubernetes provides powerful orchestration capabilities for containerized applications:
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Deployment Configuration</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10`}
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Service Configuration</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer`}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              Configuration Management
            </h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Managing configuration and secrets securely in Kubernetes:
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">ConfigMap Example</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  API_URL: "https://api.example.com"
  LOG_LEVEL: "info"
  FEATURE_FLAGS: "new-ui,beta-features"

---
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: dXNlcg==  # base64 encoded
  password: cGFzcw==  # base64 encoded
  url: cG9zdGdyZXNxbDovL3VzZXI6cGFzc0BkYjozMzA2L215YXBw`}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">CI/CD Pipeline</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Automating the build and deployment process:
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">GitHub Actions Workflow</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`name: Deploy to Kubernetes
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker image
      run: |
        docker build -t myapp:\${{ github.sha }} .
        docker tag myapp:\${{ github.sha }} myapp:latest
    
    - name: Push to registry
      run: |
        echo \${{ secrets.DOCKER_PASSWORD }} | docker login -u \${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push myapp:\${{ github.sha }}
        docker push myapp:latest
    
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/myapp-deployment myapp=myapp:\${{ github.sha }}
        kubectl rollout status deployment/myapp-deployment`}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Monitoring and Observability</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Essential tools for monitoring Kubernetes deployments:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2">Prometheus</h4>
                <p className="text-gray-400 text-sm">Metrics collection and monitoring</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2">Grafana</h4>
                <p className="text-gray-400 text-sm">Visualization and dashboards</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2">Jaeger</h4>
                <p className="text-gray-400 text-sm">Distributed tracing</p>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 mb-6">
              <h4 className="font-bold text-orange-400 mb-3">⚠️ Security Best Practices</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• Use non-root containers</li>
                <li>• Implement network policies</li>
                <li>• Regular security scans</li>
                <li>• RBAC configuration</li>
                <li>• Secret management</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Scaling Strategies</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Kubernetes provides multiple scaling options:
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Horizontal Pod Autoscaler</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80`}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Troubleshooting Common Issues</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2">Pod Issues</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• kubectl describe pod</li>
                  <li>• kubectl logs</li>
                  <li>• Check resource limits</li>
                  <li>• Verify image tags</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2">Service Issues</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• kubectl get endpoints</li>
                  <li>• Check selector labels</li>
                  <li>• Verify port mappings</li>
                  <li>• Test connectivity</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Conclusion</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Docker and Kubernetes provide a powerful combination for modern application deployment. By following best practices for containerization, orchestration, and monitoring, you can create robust, scalable, and maintainable deployment pipelines.
            </p>

            <p className="text-gray-300 leading-relaxed">
              The key to success lies in understanding both tools deeply, implementing proper security measures, and establishing comprehensive monitoring and observability practices. Start small, iterate, and gradually adopt more advanced features as your needs grow.
            </p>
          </div>
        </motion.div>

        {/* Author Info */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <Ship className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">Mike Rodriguez</h3>
                <p className="text-gray-400 text-sm">DevOps Engineer & Cloud Architect</p>
                <p className="text-gray-500 text-sm">Specialized in container orchestration and cloud-native technologies with extensive experience in production deployments.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DockerKubernetesDeployment; 