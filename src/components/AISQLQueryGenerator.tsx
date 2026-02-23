import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle,
  Sparkles,
  Code,
  Zap,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { generateSQLQuery } from '../utils/aiApi';

const AISQLQueryGenerator: React.FC = () => {
  const [databaseType, setDatabaseType] = useState('MySQL');
  const [tableSchema, setTableSchema] = useState('');
  const [queryRequirement, setQueryRequirement] = useState('');
  const [complexityLevel, setComplexityLevel] = useState('Basic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    explanation: true,
    usecases: true,
    examples: true,
    faq: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleGenerate = async () => {
    if (!tableSchema.trim() || !queryRequirement.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await generateSQLQuery(
        databaseType,
        tableSchema,
        queryRequirement,
        complexityLevel
      );
      setResult(response.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate SQL query');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const databaseTypes = ['MySQL', 'PostgreSQL', 'SQLite', 'SQL Server'];
  const complexityLevels = ['Basic', 'Intermediate', 'Advanced'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-6">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            AI SQL Query Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Transform your natural language requirements into optimized SQL queries instantly
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Query Configuration
              </h2>

              {/* Database Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Database Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {databaseTypes.map((db) => (
                    <button
                      key={db}
                      onClick={() => setDatabaseType(db)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        databaseType === db
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {db}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complexity Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Complexity Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {complexityLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => setComplexityLevel(level)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        complexityLevel === level
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Schema */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Table Schema <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={tableSchema}
                  onChange={(e) => setTableSchema(e.target.value)}
                  placeholder="e.g.,&#10;CREATE TABLE users (&#10;  id INT PRIMARY KEY,&#10;  name VARCHAR(100),&#10;  email VARCHAR(255),&#10;  created_at TIMESTAMP&#10;);"
                  className="w-full h-40 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              {/* Query Requirement */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Query Requirement <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={queryRequirement}
                  onChange={(e) => setQueryRequirement(e.target.value)}
                  placeholder="Describe what you want to achieve with your query in plain English..."
                  className="w-full h-32 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Query...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate SQL Query
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {result ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-indigo-500" />
                    Generated SQL Query
                  </h2>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="p-6">
                  <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-6 rounded-xl overflow-x-auto font-mono text-sm whitespace-pre-wrap">
                    {result}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Code className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Enter your query requirements and click generate to see the SQL query
                </p>
              </div>
            )}

            {/* Content Sections */}
            <div className="mt-8 space-y-4">
              {/* What is AI SQL Generator */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleSection('explanation')}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    What is an AI SQL Query Generator?
                  </h2>
                  {expandedSections.explanation ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.explanation && (
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 space-y-4">
                    <p>
                      An AI SQL Query Generator is a powerful tool that transforms natural language descriptions into optimized SQL queries. Instead of spending hours writing complex queries, you simply describe what you want to accomplish in plain English, and the AI understands your intent and generates the appropriate SQL code.
                    </p>
                    <p>
                      This technology leverages large language models trained on millions of SQL queries and database schemas. The AI doesn't just generate random code—it understands database relationships, proper syntax for different database systems (MySQL, PostgreSQL, SQLite, SQL Server), and best practices for query optimization.
                    </p>
                    <p>
                      Whether you're a beginner learning SQL or an experienced developer working with complex joins and aggregations, an AI SQL generator can significantly accelerate your workflow. It serves as an intelligent assistant that helps you write better queries faster, while also teaching you optimal approaches through its explanations.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6">Why Developers Struggle with Complex Queries</h3>
                    <p>
                      Writing complex SQL queries is one of the most challenging aspects of database development. Developers face numerous challenges: remembering specific syntax variations between database systems, constructing efficient JOINs across multiple tables, implementing window functions for advanced analytics, optimizing query performance, and handling edge cases in data retrieval.
                    </p>
                    <p>
                      Even experienced developers spend considerable time debugging query errors, rethinking JOIN conditions, and researching optimal approaches. Students learning SQL often struggle to translate their conceptual understanding of data relationships into proper SQL syntax. An AI SQL generator addresses these pain points by providing instant, accurate, and optimized queries.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6">How AI Converts Natural Language to SQL</h3>
                    <p>
                      The AI uses sophisticated pattern recognition and contextual understanding to convert your requirements into SQL. It analyzes your table schema to understand the available columns, data types, and relationships. Then it interprets your natural language requirement to determine the appropriate SQL operations—whether that's simple SELECT statements, complex JOINs, aggregations with GROUP BY, or advanced window functions.
                    </p>
                    <p>
                      The AI considers the complexity level you specify (Basic, Intermediate, or Advanced) to tailor the query appropriately. For basic queries, it generates simple SELECT statements with WHERE clauses. For intermediate complexity, it incorporates JOINs, subqueries, and basic aggregations. For advanced queries, it utilizes window functions, Common Table Expressions (CTEs), and sophisticated optimization techniques.
                    </p>
                  </div>
                )}
              </div>

              {/* Use Cases */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleSection('usecases')}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-500" />
                    Use Cases
                  </h2>
                  {expandedSections.usecases ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.usecases && (
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Backend Development</h4>
                        <p className="text-sm">Build complex queries for your applications, APIs, and data processing pipelines without manual SQL writing.</p>
                      </div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Data Analysis</h4>
                        <p className="text-sm">Quickly extract insights from databases with aggregations, joins, and analytical functions.</p>
                      </div>
                      <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                        <h4 className="font-semibold text-pink-700 dark:text-pink-300 mb-2">Interview Preparation</h4>
                        <p className="text-sm">Practice SQL problems with real-world scenarios and see optimized solutions instantly.</p>
                      </div>
                      <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                        <h4 className="font-semibold text-cyan-700 dark:text-cyan-300 mb-2">Reporting Dashboards</h4>
                        <p className="text-sm">Create queries for dynamic reports, KPIs, and business intelligence dashboards.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Example */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleSection('examples')}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-indigo-500" />
                    Example
                  </h2>
                  {expandedSections.examples ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.examples && (
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Input:</h4>
                      <p className="text-sm"><strong>Database:</strong> PostgreSQL</p>
                      <p className="text-sm"><strong>Table Schema:</strong> CREATE TABLE orders (id INT, customer_name VARCHAR(100), product VARCHAR(255), quantity INT, price DECIMAL(10,2), order_date DATE);</p>
                      <p className="text-sm"><strong>Requirement:</strong> Show total revenue by product for the last month</p>
                    </div>
                    <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">Output:</h4>
                      <pre className="text-sm text-gray-300 overflow-x-auto">
{`SELECT 
    product,
    SUM(quantity * price) AS total_revenue,
    COUNT(*) AS total_orders
FROM orders
WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
  AND order_date < DATE_TRUNC('month', CURRENT_DATE)
GROUP BY product
ORDER BY total_revenue DESC;`}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* FAQ */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleSection('faq')}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-indigo-500" />
                    Frequently Asked Questions
                  </h2>
                  {expandedSections.faq ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.faq && (
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 space-y-4">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Is the generated SQL query safe to use?</h4>
                      <p className="text-sm">The AI generates SQL based on your provided schema. Always review the generated query before executing it in production environments. The tool provides explanations and optimization notes to help you understand and validate the query.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Which database systems are supported?</h4>
                      <p className="text-sm">Currently supported databases include MySQL, PostgreSQL, SQLite, and SQL Server. Each has slightly different syntax, and the AI adapts the query accordingly.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Can the AI handle complex JOINs?</h4>
                      <p className="text-sm">Yes, the AI can generate complex queries with multiple JOINs, subqueries, window functions, and CTEs. Select "Advanced" complexity level for these features.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Does the tool provide query optimization?</h4>
                      <p className="text-sm">Yes, the AI provides optimization notes and index suggestions for each generated query to help improve performance.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Can I learn SQL using this tool?</h4>
                      <p className="text-sm">Absolutely! The tool provides detailed explanations of each query, making it an excellent learning resource. You can see how natural language requirements translate into SQL syntax.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Generate Optimized SQL Queries Instantly
                </h3>
                <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
                  Stop struggling with complex SQL syntax. Let AI transform your requirements into production-ready queries in seconds.
                </p>
                <button
                  onClick={() => {
                    document.querySelector('button')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Try Now - It's Free
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AISQLQueryGenerator;
