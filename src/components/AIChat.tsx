/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {  
  Send, 
  Trash2, 
  Copy, 
  Check, 
  Bot, 
  User, 
  Sparkles,
  AlertCircle,
  Menu,
  Plus,
  MessageSquare,
  X,
  ChevronLeft
} from 'lucide-react';
import { streamChat, ChatMessage } from '../utils/aiApi';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const AIChat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai-chat-conversations');
    if (saved) {
      try {
        const parsed: Conversation[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sort by updatedAt descending
          const sorted = parsed.sort((a, b) => b.updatedAt - a.updatedAt);
          setConversations(sorted);
          // Load most recent conversation
          if (sorted[0]) {
            setActiveConversationId(sorted[0].id);
            setMessages(sorted[0].messages);
          }
        }
      } catch (e) {
        console.error('Failed to load saved conversations:', e);
      }
    }
  }, []);

  // Save conversations to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('ai-chat-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  // Focus input on load
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleCopyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateTitle = (firstMessage: string): string => {
    const title = firstMessage.slice(0, 30);
    return title.length < firstMessage.length ? `${title}...` : title;
  };

  const createNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setMessages([]);
    setError(null);
    setIsMobileSidebarOpen(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleSelectConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setActiveConversationId(conversationId);
      setMessages(conversation.messages);
      setError(null);
      setIsMobileSidebarOpen(false);
    }
  };

  const handleDeleteConversation = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      const updatedConversations = conversations.filter(c => c.id !== conversationId);
      setConversations(updatedConversations);
      
      if (activeConversationId === conversationId) {
        if (updatedConversations.length > 0) {
          setActiveConversationId(updatedConversations[0].id);
          setMessages(updatedConversations[0].messages);
        } else {
          setActiveConversationId(null);
          setMessages([]);
        }
      }
      
      if (updatedConversations.length === 0) {
        localStorage.removeItem('ai-chat-conversations');
      }
    }
  };

  const handleClearChat = () => {
    if (messages.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      setMessages([]);
      
      if (activeConversationId) {
        setConversations(prev => 
          prev.map(c => 
            c.id === activeConversationId 
              ? { ...c, messages: [], updatedAt: Date.now() }
              : c
          )
        );
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Create new conversation if none exists
    let currentConversationId = activeConversationId;
    if (!currentConversationId) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setConversations(prev => [newConversation, ...prev]);
      currentConversationId = newConversation.id;
      setActiveConversationId(currentConversationId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      isStreaming: true
    };

    // Update messages and conversation title if it's a new chat
    const updatedMessages = [...messages, userMessage, assistantMessage];
    setMessages(updatedMessages);
    
    // Update conversation title with first user message
    setConversations(prev => 
      prev.map(c => 
        c.id === currentConversationId 
          ? { 
              ...c, 
              messages: updatedMessages,
              title: c.title === 'New Chat' ? generateTitle(userMessage.content) : c.title,
              updatedAt: Date.now()
            }
          : c
      )
    );

    setInput('');
    setIsLoading(true);
    setError(null);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      const conversationHistory: ChatMessage[] = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const stream = await streamChat(conversationHistory, userMessage.content);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                setMessages(prev => 
                  prev.map(m => 
                    m.id === assistantMessage.id 
                      ? { ...m, content: fullContent }
                      : m
                  )
                );
                
                // Update conversation in list
                setConversations(prev => 
                  prev.map(c => {
                    if (c.id !== currentConversationId) return c;
                    const updatedMessages = c.messages.map(m => 
                      m.id === assistantMessage.id 
                        ? { ...m, content: fullContent }
                        : m
                    );
                    return {
                      ...c,
                      messages: updatedMessages,
                      updatedAt: Date.now()
                    };
                  })
                );
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }

      // Mark streaming as complete
      setMessages(prev => 
        prev.map(m => 
          m.id === assistantMessage.id 
            ? { ...m, isStreaming: false }
            : m
        )
      );
      
      // Update conversation with final message
      setConversations(prev => 
        prev.map(c => {
          if (c.id !== currentConversationId) return c;
          const updatedMessages = c.messages.map(m => 
            m.id === assistantMessage.id 
              ? { ...m, isStreaming: false }
              : m
          );
          return {
            ...c,
            messages: updatedMessages,
            updatedAt: Date.now()
          };
        })
      );
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
      setError(errorMessage);
      
      // Update the assistant message with error
      setMessages(prev => 
        prev.map(m => 
          m.id === assistantMessage.id 
            ? { ...m, content: `Sorry, I encountered an error: ${errorMessage}`, isStreaming: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const CodeBlock = ({ language, code }: { language?: string; code: string }) => {
    const codeId = `${code.slice(0, 50)}-${language || 'text'}`;
    const isCopied = copiedCode === codeId;

    return (
      <div className="relative group my-4 rounded-lg overflow-hidden mt-[500px]">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-700 text-gray-300 text-xs">
          <span>{language || 'code'}</span>
          <button
            onClick={() => handleCopyCode(code, codeId)}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <SyntaxHighlighter
          language={language || 'text'}
          style={oneDark}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '0.875rem'
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex pt-16">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || isMobileSidebarOpen) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.2 }}
            className={`bg-gray-800 border-r border-gray-700 flex flex-col h-screen fixed lg:relative z-50 w-[280px]`}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-700">
              <button
                onClick={createNewChat}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                New Chat
              </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="text-xs text-gray-400 px-3 py-2 uppercase tracking-wider">
                Chat History
              </div>
              {conversations.length === 0 ? (
                <div className="px-3 py-8 text-center text-gray-500 text-sm">
                  No conversations yet. Start a new chat!
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation.id)}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        activeConversationId === conversation.id
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {conversation.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(conversation.updatedAt)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteConversation(e, conversation.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded transition-all"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span>Guest User</span>
              </div>
            </div>

            {/* Close Sidebar Button (Mobile) */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-3 right-3 p-2 lg:hidden hover:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen min-h-screen">
        {/* Header */}
        <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg lg:hidden"
            >
              <Menu className="w-5 h-5 text-gray-300" />
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg hidden lg:block"
              title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <ChevronLeft className={`w-5 h-5 text-gray-300 transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`} />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-white">AI Chat</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={createNewChat}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
            <button
              onClick={handleClearChat}
              disabled={messages.length === 0}
              className="p-2 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                How can I help you today?
              </h2>
              <p className="text-gray-400 max-w-md">
                Ask me anything! I can help with coding, writing, analysis, questions, and more.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-blue-500' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`flex-1 max-w-[80%] ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
                  : 'bg-gray-800 text-gray-100 rounded-2xl rounded-tl-sm border border-gray-700'
              } px-4 py-3`}>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      code({ className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const code = String(children).replace(/\n$/, '');
                        
                        if (match || code.includes('\n')) {
                          return (
                            <CodeBlock 
                              language={match ? match[1] : undefined} 
                              code={code} 
                            />
                          );
                        }
                        return (
                          <code className={`${className} px-1.5 py-0.5 rounded bg-gray-700 text-blue-300`} {...props}>
                            {children}
                          </code>
                        );
                      },
                      p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }: any) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }: any) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                      li: ({ children }: any) => <li>{children}</li>,
                      strong: ({ children }: any) => <strong className="font-semibold text-white">{children}</strong>,
                      em: ({ children }: any) => <em>{children}</em>,
                      a: ({ href, children }: any) => (
                        <a 
                          href={href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {children}
                        </a>
                      ),
                      h1: ({ children }: any) => <h1 className="text-xl font-bold text-white mb-2">{children}</h1>,
                      h2: ({ children }: any) => <h2 className="text-lg font-bold text-white mb-2">{children}</h2>,
                      h3: ({ children }: any) => <h3 className="text-md font-semibold text-white mb-1">{children}</h3>,
                      blockquote: ({ children }: any) => <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-300 my-2">{children}</blockquote>,
                    }}
                  >
                    {message.content || (message.isStreaming ? '▌' : '')}
                  </ReactMarkdown>
                </div>
                
                {message.isStreaming && (
                  <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1" />
                )}
              </div>
            </motion.div>
          ))}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-800 rounded-lg"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isLoading}
                rows={1}
                className="w-full px-4 py-3 pr-12 bg-gray-900 border border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-gray-100 placeholder-gray-500"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
