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

/**
 * Validate Business Idea for Indian Market
 * @param businessIdea - Description of the business idea
 * @param location - Target location in India (City/State)
 * @param targetAudience - Target audience description
 * @param budget - Estimated budget in INR
 * @param industryType - Industry type
 * @param revenueModel - Revenue model (optional)
 * @returns Promise with validation results
 */
export const validateBusinessIdea = async (
  businessIdea: string,
  location: string,
  targetAudience: string,
  budget: string,
  industryType: string,
  revenueModel?: string
): Promise<{
  validation: string;
  metadata: {
    businessIdea: string;
    location: string;
    targetAudience: string;
    budget: string;
    industryType: string;
    revenueModel?: string;
  };
}> => {
  return callAIEndpoint('/api/ai/business-idea-validator', {
    businessIdea,
    location,
    targetAudience,
    budget,
    industryType,
    revenueModel,
  }) as Promise<{
    validation: string;
    metadata: {
      businessIdea: string;
      location: string;
      targetAudience: string;
      budget: string;
      industryType: string;
      revenueModel?: string;
    };
  }>;
};

/**
 * Generate Startup Names
 * @param industry - Industry sector
 * @param brandPersonality - Brand personality (Modern, Premium, Bold, Minimal, Techy, Indian Cultural)
 * @param targetAudience - Target audience description
 * @param namePreference - One-word or Two-word preference
 * @param checkDomain - Whether to check domain availability
 * @param numberOfNames - Number of names to generate (1-30)
 * @returns Promise with generated names
 */
export const generateStartupNames = async (
  industry: string,
  brandPersonality: string,
  targetAudience: string,
  namePreference: string,
  checkDomain: boolean,
  numberOfNames: number = 10
): Promise<{
  names: Array<{
    name: string;
    meaning: string;
    positioning: string;
    tagline: string;
    domainStyle: string;
  }>;
  count: number;
  metadata: {
    industry: string;
    brandPersonality: string;
    targetAudience: string;
    namePreference: string;
    checkDomain: boolean;
    numberOfNames: number;
  };
}> => {
  return callAIEndpoint('/api/ai/startup-name-generator', {
    industry,
    brandPersonality,
    targetAudience,
    namePreference,
    checkDomain,
    numberOfNames,
  }) as Promise<{
    names: Array<{
      name: string;
      meaning: string;
      positioning: string;
      tagline: string;
      domainStyle: string;
    }>;
    count: number;
    metadata: {
      industry: string;
      brandPersonality: string;
      targetAudience: string;
      namePreference: string;
      checkDomain: boolean;
      numberOfNames: number;
    };
  }>;
};

/**
 * Generate Business Plan
 * @param businessName - Name of the business
 * @param industry - Industry sector
 * @param location - Business location
 * @param fundingRequired - Funding required in INR
 * @param targetMarket - Target market description
 * @param revenueModel - Revenue model
 * @param businessDescription - Short business description
 * @returns Promise with generated business plan
 */
export const generateBusinessPlan = async (
  businessName: string,
  industry: string,
  location: string,
  fundingRequired: string,
  targetMarket: string,
  revenueModel: string,
  businessDescription: string
): Promise<{
  businessPlan: string;
  metadata: {
    businessName: string;
    industry: string;
    location: string;
    fundingRequired: string;
    targetMarket: string;
    revenueModel: string;
    businessDescription: string;
  };
}> => {
  return callAIEndpoint('/api/ai/business-plan-generator', {
    businessName,
    industry,
    location,
    fundingRequired,
    targetMarket,
    revenueModel,
    businessDescription,
  }) as Promise<{
    businessPlan: string;
    metadata: {
      businessName: string;
      industry: string;
      location: string;
      fundingRequired: string;
      targetMarket: string;
      revenueModel: string;
      businessDescription: string;
    };
  }>;
};

/**
 * Prepare Business Plan for PDF Download
 * @param businessPlan - The business plan content
 * @param businessName - Name of the business
 * @returns Promise with file data
 */
export const prepareBusinessPlanPDF = async (
  businessPlan: string,
  businessName: string
): Promise<{
  content: string;
  fileName: string;
}> => {
  return callAIEndpoint('/api/ai/business-plan-pdf', {
    businessPlan,
    businessName,
  }) as Promise<{
    content: string;
    fileName: string;
  }>;
};

/**
 * Format Medical Notes
 * @param rawNotes - Raw clinical notes to format
 * @param formatType - Format type (SOAP, Progress Note, Consultation Note, EMR Structured)
 * @param specialty - Medical specialty
 * @param includeICD - Whether to include ICD-style summary
 * @returns Promise with formatted medical note
 */
export const formatMedicalNote = async (
  rawNotes: string,
  formatType: string,
  specialty: string,
  includeICD: boolean = false
): Promise<{
  formattedNote: string;
  formatType: string;
  specialty: string;
  includeICD: boolean;
  disclaimer: string;
}> => {
  return callAIEndpoint('/api/ai/medical-note-formatter', {
    rawNotes,
    formatType,
    specialty,
    includeICD,
  }) as Promise<{
    formattedNote: string;
    formatType: string;
    specialty: string;
    includeICD: boolean;
    disclaimer: string;
  }>;
};

/**
 * Generate Patient Discharge Summary
 * @param patientAge - Patient's age
 * @param patientGender - Patient's gender
 * @param admissionReason - Reason for admission
 * @param diagnosis - Diagnosis
 * @param treatmentGiven - Treatment provided
 * @param proceduresPerformed - Procedures performed
 * @param medicationsPrescribed - Medications prescribed
 * @param followUpInstructions - Follow-up instructions
 * @param hospitalStayDuration - Duration of hospital stay
 * @returns Promise with discharge summary
 */
export const generateDischargeSummary = async (
  patientAge: string,
  patientGender: string,
  admissionReason: string,
  diagnosis: string,
  treatmentGiven?: string,
  proceduresPerformed?: string,
  medicationsPrescribed?: string,
  followUpInstructions?: string,
  hospitalStayDuration?: string
): Promise<{
  dischargeSummary: string;
  patientInfo: {
    patientAge: string;
    patientGender: string;
    hospitalStayDuration?: string;
  };
  disclaimer: string;
}> => {
  return callAIEndpoint('/api/ai/discharge-summary-generator', {
    patientAge,
    patientGender,
    admissionReason,
    diagnosis,
    treatmentGiven,
    proceduresPerformed,
    medicationsPrescribed,
    followUpInstructions,
    hospitalStayDuration,
  }) as Promise<{
    dischargeSummary: string;
    patientInfo: {
      patientAge: string;
      patientGender: string;
      hospitalStayDuration?: string;
    };
    disclaimer: string;
  }>;
};

/**
 * Generate Clinic Website Content
 * @param clinicName - Name of the clinic
 * @param specialty - Medical specialty
 * @param location - Clinic location
 * @param yearsExperience - Years of experience
 * @param servicesOffered - Services offered
 * @param targetAudience - Target audience
 * @param tone - Content tone (Professional, Friendly, Premium, Community-focused)
 * @returns Promise with generated clinic content
 */
export const generateClinicContent = async (
  clinicName: string,
  specialty: string,
  location: string,
  yearsExperience?: string,
  servicesOffered?: string,
  targetAudience?: string,
  tone: string = 'Professional'
): Promise<{
  content: string;
  clinicInfo: {
    clinicName: string;
    specialty: string;
    location: string;
    tone: string;
  };
  meta: {
    generatedAt: string;
  };
}> => {
  return callAIEndpoint('/api/ai/clinic-content-generator', {
    clinicName,
    specialty,
    location,
    yearsExperience,
    servicesOffered,
    targetAudience,
    tone,
  }) as Promise<{
    content: string;
    clinicInfo: {
      clinicName: string;
      specialty: string;
      location: string;
      tone: string;
    };
    meta: {
      generatedAt: string;
    };
  }>;
};

/**
 * Generate SQL Query
 * @param databaseType - Database type (MySQL, PostgreSQL, SQLite, SQL Server)
 * @param tableSchema - Table schema definition
 * @param queryRequirement - Natural language query requirement
 * @param complexityLevel - Complexity level (Basic, Intermediate, Advanced)
 * @returns Promise with generated SQL query
 */
export const generateSQLQuery = async (
  databaseType: string,
  tableSchema: string,
  queryRequirement: string,
  complexityLevel: string = 'Basic'
): Promise<{
  result: string;
  metadata: {
    databaseType: string;
    complexityLevel: string;
    generatedAt: string;
  };
}> => {
  return callAIEndpoint('/api/ai/generate-sql', {
    databaseType,
    tableSchema,
    queryRequirement,
    complexityLevel,
  }) as Promise<{
    result: string;
    metadata: {
      databaseType: string;
      complexityLevel: string;
      generatedAt: string;
    };
  }>;
};

/**
 * Generate Project Description
 * @param projectName - Name of the project
 * @param technologyStack - Technology stack used
 * @param purpose - Project purpose
 * @param features - Key features
 * @param targetAudience - Target audience
 * @param tone - Tone (Technical, Professional, Investor-ready, Resume-friendly)
 * @returns Promise with generated project description
 */
export const generateProjectDescription = async (
  projectName: string,
  technologyStack: string,
  purpose: string,
  features?: string,
  targetAudience?: string,
  tone: string = 'Technical'
): Promise<{
  result: string;
  metadata: {
    projectName: string;
    technologyStack: string;
    tone: string;
    generatedAt: string;
  };
}> => {
  return callAIEndpoint('/api/ai/generate-project-description', {
    projectName,
    technologyStack,
    purpose,
    features,
    targetAudience,
    tone,
  }) as Promise<{
    result: string;
    metadata: {
      projectName: string;
      technologyStack: string;
      tone: string;
      generatedAt: string;
    };
  }>;
};

/**
 * Generate Internship Cover Letter
 * @param studentName - Student's name
 * @param degree - Degree/Diploma
 * @param college - College/University name
 * @param skills - Skills list
 * @param targetCompany - Target company name
 * @param internshipRole - Internship role
 * @param experienceLevel - Experience level
 * @param tone - Tone (Formal, Confident, Enthusiastic)
 * @returns Promise with generated cover letter
 */
export const generateCoverLetter = async (
  studentName: string,
  degree: string,
  college: string,
  skills: string,
  targetCompany: string,
  internshipRole: string,
  experienceLevel?: string,
  tone: string = 'Formal'
): Promise<{
  result: string;
  metadata: {
    studentName: string;
    degree: string;
    targetCompany: string;
    internshipRole: string;
    tone: string;
    generatedAt: string;
  };
}> => {
  return callAIEndpoint('/api/ai/generate-cover-letter', {
    studentName,
    degree,
    college,
    skills,
    targetCompany,
    internshipRole,
    experienceLevel,
    tone,
  }) as Promise<{
    result: string;
    metadata: {
      studentName: string;
      degree: string;
      targetCompany: string;
      internshipRole: string;
      tone: string;
      generatedAt: string;
    };
  }>;
};

/**
 * Generate Personal Statement
 * @param name - Applicant's name
 * @param fieldOfStudy - Field of study
 * @param academicAchievements - Academic achievements
 * @param careerGoals - Career goals
 * @param targetUniversity - Target university/program
 * @param tone - Tone (Inspirational, Academic, Professional)
 * @returns Promise with generated personal statement
 */
export const generatePersonalStatement = async (
  name: string,
  fieldOfStudy: string,
  academicAchievements: string,
  careerGoals: string,
  targetUniversity?: string,
  tone: string = 'Academic'
): Promise<{
  result: string;
  metadata: {
    name: string;
    fieldOfStudy: string;
    targetUniversity: string;
    tone: string;
    generatedAt: string;
  };
}> => {
  return callAIEndpoint('/api/ai/generate-personal-statement', {
    name,
    fieldOfStudy,
    academicAchievements,
    careerGoals,
    targetUniversity,
    tone,
  }) as Promise<{
    result: string;
    metadata: {
      name: string;
      fieldOfStudy: string;
      targetUniversity: string;
      tone: string;
      generatedAt: string;
    };
  }>;
};

/**
 * Generate Portfolio Bio
 * @param name - Person's name
 * @param role - Professional role
 * @param skills - Skills list
 * @param yearsOfExperience - Years of experience
 * @param achievements - Achievements
 * @param tone - Tone (Professional, Friendly, Bold, Minimal)
 * @returns Promise with generated portfolio bio
 */
export const generatePortfolioBio = async (
  name: string,
  role: string,
  skills: string,
  yearsOfExperience?: string,
  achievements?: string,
  tone: string = 'Professional'
): Promise<{
  result: string;
  metadata: {
    name: string;
    role: string;
    tone: string;
    generatedAt: string;
  };
}> => {
  return callAIEndpoint('/api/ai/generate-portfolio-bio', {
    name,
    role,
    skills,
    yearsOfExperience,
    achievements,
    tone,
  }) as Promise<{
    result: string;
    metadata: {
      name: string;
      role: string;
      tone: string;
      generatedAt: string;
    };
  }>;
};

/**
 * Generate Meeting Summary
 * @param meetingTranscript - Meeting transcript
 * @param meetingType - Meeting type (Client, Internal, Sales, Scrum)
 * @param outputStyle - Output style (Bullet Summary, Detailed Report, Action Items Only)
 * @returns Promise with generated meeting summary
 */
export const generateMeetingSummary = async (
  meetingTranscript: string,
  meetingType: string,
  outputStyle: string = 'Bullet Summary'
): Promise<{
  result: string;
  metadata: {
    meetingType: string;
    outputStyle: string;
    generatedAt: string;
  };
}> => {
  return callAIEndpoint('/api/ai/generate-meeting-summary', {
    meetingTranscript,
    meetingType,
    outputStyle,
  }) as Promise<{
    result: string;
    metadata: {
      meetingType: string;
      outputStyle: string;
      generatedAt: string;
    };
  }>;
};

/**
 * Message type for chat
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Streaming Chat with AI
 * @param messages - Previous conversation messages
 * @param message - Current message to send
 * @returns Promise with ReadableStream for streaming response
 */
export const streamChat = async (
  messages: ChatMessage[],
  message: string
): Promise<ReadableStream<Uint8Array>> => {
  const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, message }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to connect to AI service');
  }

  if (!response.body) {
    throw new Error('No response body');
  }

  return response.body;
};
