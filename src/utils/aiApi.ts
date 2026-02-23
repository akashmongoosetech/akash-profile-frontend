/**
 * AI API Utility
 * Handles all AI-powered tool API calls to the backend using fetch API
 */

import { API_BASE_URL } from './api';

/**
 * Call AI endpoint with proper error handling
 */
const callAIEndpoint = async (
  endpoint: string,
  body: Record<string, unknown>
): Promise<unknown> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return data.data;
    } else {
      throw new Error(data.error || 'Failed to generate response');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to connect to AI service. Please try again.');
  }
};

/**
 * Generate AI Email Reply
 * @param originalEmail - The original email content to reply to
 * @param tone - Tone of the reply (Professional, Friendly, Formal, Apology, Follow-up)
 * @param length - Length preference (Short, Medium, Long)
 * @returns Promise with generated reply
 */
export const generateEmailReply = async (
  originalEmail: string,
  tone: string,
  length: string
): Promise<{ reply: string; tone: string; length: string }> => {
  return callAIEndpoint('/api/ai/email-reply', {
    originalEmail,
    tone,
    length,
  }) as Promise<{ reply: string; tone: string; length: string }>;
};

/**
 * Generate LinkedIn Post
 * @param topic - The main topic for the post
 * @param experienceLevel - Experience level (Student, Junior, Mid, Senior)
 * @param postType - Type of post (Educational, Storytelling, Achievement, Hiring, Opinion)
 * @param includeHashtags - Whether to include hashtags
 * @returns Promise with generated post and metadata
 */
export const generateLinkedInPost = async (
  topic: string,
  experienceLevel: string,
  postType: string,
  includeHashtags: boolean
): Promise<{
  post: string;
  hashtags: string[];
  metadata: {
    topic: string;
    experienceLevel: string;
    postType: string;
    includeHashtags: boolean;
  };
}> => {
  return callAIEndpoint('/api/ai/linkedin-post', {
    topic,
    experienceLevel,
    postType,
    includeHashtags,
  }) as Promise<{
    post: string;
    hashtags: string[];
    metadata: {
      topic: string;
      experienceLevel: string;
      postType: string;
      includeHashtags: boolean;
    };
  }>;
};

/**
 * Generate Project Ideas for Students
 * @param technology - Main technology (React, Node, Python, AI, Full Stack, etc.)
 * @param difficultyLevel - Difficulty level (Beginner, Intermediate, Advanced)
 * @param projectType - Type of project (Web App, Mobile App, AI Tool, SaaS, Automation)
 * @param numberOfIdeas - Number of ideas to generate (1-5)
 * @returns Promise with generated project ideas
 */
export const generateProjectIdeas = async (
  technology: string,
  difficultyLevel: string,
  projectType: string,
  numberOfIdeas: number
): Promise<{
  projects: Array<{
    name: string;
    description: string;
    features: string[];
    techStack: string;
    bonusFeature: string;
  }>;
  count: number;
  metadata: {
    technology: string;
    difficultyLevel: string;
    projectType: string;
    numberOfIdeas: number;
  };
}> => {
  return callAIEndpoint('/api/ai/project-ideas', {
    technology,
    difficultyLevel,
    projectType,
    numberOfIdeas,
  }) as Promise<{
    projects: Array<{
      name: string;
      description: string;
      features: string[];
      techStack: string;
      bonusFeature: string;
    }>;
    count: number;
    metadata: {
      technology: string;
      difficultyLevel: string;
      projectType: string;
      numberOfIdeas: number;
    };
  }>;
};
