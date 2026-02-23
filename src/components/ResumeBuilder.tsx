import React, { useState, useRef, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Github, 
  Linkedin, 
  Globe,
  Award,
  Eye,
  EyeOff,
  RefreshCw,
  Monitor,
  Moon,
  FileText
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * ResumeBuilder Component
 * 
 * A tech-focused resume builder with PDF export capabilities.
 * Features:
 * - Personal details with profile photo URL
 * - Professional summary
 * - Dynamic skills (by category)
 * - Dynamic projects
 * - Dynamic work experience
 * - Education history
 * - Certifications
 * - Social links (GitHub, LinkedIn, Portfolio)
 * - Live preview
 * - Light/Dark theme
 * - PDF download
 * - Print functionality
 */

// ==================== TypeScript Interfaces ====================

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
  highlights: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  portfolio: string;
}

export interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
    photoUrl: string;
  };
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  social: SocialLinks;
  theme: 'light' | 'dark';
}

// ==================== Default Data ====================

const createEmptySkill = (): Skill => ({
  id: crypto.randomUUID(),
  name: '',
  category: 'Technical'
});

const createEmptyProject = (): Project => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  technologies: '',
  link: '',
  highlights: ['']
});

const createEmptyExperience = (): Experience => ({
  id: crypto.randomUUID(),
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  current: false,
  description: ''
});

const createEmptyEducation = (): Education => ({
  id: crypto.randomUUID(),
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  current: false,
  description: ''
});

const createEmptyCertification = (): Certification => ({
  id: crypto.randomUUID(),
  name: '',
  issuer: '',
  date: '',
  link: ''
});

const getDefaultResumeData = (): ResumeData => ({
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
    photoUrl: ''
  },
  skills: [],
  projects: [],
  experience: [],
  education: [],
  certifications: [],
  social: {
    github: '',
    linkedin: '',
    portfolio: ''
  },
  theme: 'dark'
});

const SKILL_CATEGORIES = ['Technical', 'Frameworks', 'Tools', 'Soft Skills', 'Languages', 'Databases', 'Cloud'];

// ==================== Component ====================

const ResumeBuilder: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);

  // Resume Data State
  const [personal, setPersonal] = useState(getDefaultResumeData().personal);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [social, setSocial] = useState<SocialLinks>(getDefaultResumeData().social);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showPreview, setShowPreview] = useState(true);

  // Add item functions
  const addSkill = () => setSkills([...skills, createEmptySkill()]);
  const addProject = () => setProjects([...projects, createEmptyProject()]);
  const addExperience = () => setExperience([...experience, createEmptyExperience()]);
  const addEducation = () => setEducation([...education, createEmptyEducation()]);
  const addCertification = () => setCertifications([...certifications, createEmptyCertification()]);

  // Remove item functions
  const removeSkill = (id: string) => setSkills(skills.filter(s => s.id !== id));
  const removeProject = (id: string) => setProjects(projects.filter(p => p.id !== id));
  const removeExperience = (id: string) => setExperience(experience.filter(e => e.id !== id));
  const removeEducation = (id: string) => setEducation(education.filter(e => e.id !== id));
  const removeCertification = (id: string) => setCertifications(certifications.filter(c => c.id !== id));

  // Update functions
  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setSkills(skills.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setExperience(experience.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCertifications(certifications.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // Group skills by category
  const groupedSkills = useMemo(() => {
    const groups: Record<string, Skill[]> = {};
    skills.forEach(skill => {
      const category = skill.category || 'Technical';
      if (!groups[category]) groups[category] = [];
      groups[category].push(skill);
    });
    return groups;
  }, [skills]);

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const isDark = theme === 'dark';
    const textColor = isDark ? [255, 255, 255] as [number, number, number] : [40, 40, 40] as [number, number, number];
    const bgColor = isDark ? [30, 30, 30] as [number, number, number] : [255, 255, 255] as [number, number, number];
    const secondaryText = isDark ? [200, 200, 200] as [number, number, number] : [100, 100, 100] as [number, number, number];
    const accentColor = [59, 130, 246] as [number, number, number];

    // Background
    doc.setFillColor(...bgColor);
    doc.rect(0, 0, 210, 297, 'F');

    // Name & Title
    doc.setFontSize(24);
    doc.setTextColor(...textColor);
    doc.text(personal.fullName || 'Your Name', 20, 25);

    doc.setFontSize(12);
    doc.setTextColor(...accentColor);
    doc.text(personal.title || 'Professional Title', 20, 33);

    // Contact Info
    doc.setFontSize(9);
    doc.setTextColor(...secondaryText);
    let contactY = 42;
    if (personal.email) {
      doc.text(`✉ ${personal.email}`, 20, contactY);
      contactY += 5;
    }
    if (personal.phone) {
      doc.text(`📞 ${personal.phone}`, 20, contactY);
      contactY += 5;
    }
    if (personal.location) {
      doc.text(`📍 ${personal.location}`, 20, contactY);
      contactY += 5;
    }

    // Social Links
    let socialY = contactY + 3;
    doc.setFontSize(8);
    if (social.github) doc.text(`GitHub: ${social.github}`, 20, socialY);
    if (social.linkedin) doc.text(`LinkedIn: ${social.linkedin}`, 100, socialY);
    if (social.portfolio) {
      socialY += 5;
      doc.text(`Portfolio: ${social.portfolio}`, 20, socialY);
    }

    let currentY = socialY + 10;

    // Summary
    if (personal.summary) {
      doc.setFontSize(14);
      doc.setTextColor(...textColor);
      doc.text('Professional Summary', 20, currentY);
      doc.setDrawColor(...accentColor);
      doc.line(20, currentY + 2, 190, currentY + 2);
      
      currentY += 8;
      doc.setFontSize(9);
      doc.setTextColor(...secondaryText);
      const summaryLines = doc.splitTextToSize(personal.summary, 170);
      doc.text(summaryLines, 20, currentY);
      currentY += summaryLines.length * 4 + 10;
    }

    // Skills
    if (skills.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(...textColor);
      doc.text('Technical Skills', 20, currentY);
      doc.line(20, currentY + 2, 190, currentY + 2);
      currentY += 8;

      doc.setFontSize(9);
      Object.entries(groupedSkills).forEach(([category, categorySkills]) => {
        const skillNames = categorySkills.map(s => s.name).join(', ');
        doc.setTextColor(...accentColor);
        doc.text(`${category}: `, 20, currentY);
        doc.setTextColor(...secondaryText);
        doc.text(skillNames, 50, currentY);
        currentY += 5;
      });
      currentY += 5;
    }

    // Experience
    if (experience.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(...textColor);
      doc.text('Work Experience', 20, currentY);
      doc.line(20, currentY + 2, 190, currentY + 2);
      currentY += 8;

      experience.forEach(exp => {
        doc.setFontSize(11);
        doc.setTextColor(...textColor);
        doc.text(exp.position, 20, currentY);
        
        doc.setFontSize(9);
        doc.setTextColor(...accentColor);
        doc.text(exp.company, 20, currentY + 5);
        
        doc.setTextColor(...secondaryText);
        const dateRange = exp.current 
          ? `${exp.startDate} - Present`
          : `${exp.startDate} - ${exp.endDate}`;
        doc.text(dateRange, 190, currentY, { align: 'right' });
        
        if (exp.description) {
          currentY += 10;
          doc.setFontSize(8);
          const descLines = doc.splitTextToSize(exp.description, 170);
          doc.text(descLines, 20, currentY);
          currentY += descLines.length * 4;
        }
        currentY += 10;
      });
    }

    // Projects
    if (projects.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(...textColor);
      doc.text('Projects', 20, currentY);
      doc.line(20, currentY + 2, 190, currentY + 2);
      currentY += 8;

      projects.forEach(proj => {
        doc.setFontSize(11);
        doc.setTextColor(...textColor);
        doc.text(proj.name, 20, currentY);
        
        if (proj.technologies) {
          doc.setFontSize(8);
          doc.setTextColor(...accentColor);
          doc.text(proj.technologies, 190, currentY, { align: 'right' });
        }
        
        if (proj.description) {
          currentY += 5;
          doc.setFontSize(8);
          doc.setTextColor(...secondaryText);
          const descLines = doc.splitTextToSize(proj.description, 170);
          doc.text(descLines, 20, currentY);
          currentY += descLines.length * 4;
        }
        currentY += 8;
      });
    }

    // Education
    if (education.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(...textColor);
      doc.text('Education', 20, currentY);
      doc.line(20, currentY + 2, 190, currentY + 2);
      currentY += 8;

      education.forEach(edu => {
        doc.setFontSize(11);
        doc.setTextColor(...textColor);
        doc.text(edu.degree, 20, currentY);
        
        doc.setFontSize(9);
        doc.setTextColor(...accentColor);
        doc.text(edu.institution, 20, currentY + 5);
        
        doc.setTextColor(...secondaryText);
        const dateRange = edu.current 
          ? `${edu.startDate} - Present`
          : `${edu.startDate} - ${edu.endDate}`;
        doc.text(dateRange, 190, currentY, { align: 'right' });
        currentY += 12;
      });
    }

    // Certifications
    if (certifications.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(...textColor);
      doc.text('Certifications', 20, currentY);
      doc.line(20, currentY + 2, 190, currentY + 2);
      currentY += 8;

      certifications.forEach(cert => {
        doc.setFontSize(10);
        doc.setTextColor(...textColor);
        doc.text(cert.name, 20, currentY);
        
        doc.setFontSize(8);
        doc.setTextColor(...secondaryText);
        doc.text(`${cert.issuer} - ${cert.date}`, 190, currentY, { align: 'right' });
        currentY += 7;
      });
    }

    doc.save(`${personal.fullName || 'resume'}_resume.pdf`);
  };

  // Print resume
  const handlePrint = () => {
    window.print();
  };

  // Reset form
  const handleReset = () => {
    setPersonal(getDefaultResumeData().personal);
    setSkills([]);
    setProjects([]);
    setExperience([]);
    setEducation([]);
    setCertifications([]);
    setSocial(getDefaultResumeData().social);
    setTheme('dark');
  };

  // Render section header
  const renderSectionHeader = (icon: React.ReactNode, title: string) => (
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="text-white font-semibold text-lg">{title}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Resume Builder</h1>
          <p className="text-gray-400">Create a professional tech resume</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-between mb-6 no-print">
          <div className="flex gap-3">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
              {theme === 'light' ? 'Dark' : 'Light'} Theme
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-1 xl:grid-cols-2 gap-8 ${showPreview ? '' : 'max-w-3xl mx-auto'}`}>
          {/* Form Section */}
          <div className="space-y-6">
            {/* Personal Details */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              {renderSectionHeader(<User className="w-5 h-5 text-blue-400" />, 'Personal Details')}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                  <input
                    type="text"
                    value={personal.fullName}
                    onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={personal.title}
                    onChange={(e) => setPersonal({ ...personal, title: e.target.value })}
                    placeholder="Full Stack Developer"
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Location</label>
                  <input
                    type="text"
                    value={personal.location}
                    onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
                    placeholder="San Francisco, CA"
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Email</label>
                  <input
                    type="email"
                    value={personal.email}
                    onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Phone</label>
                  <input
                    type="text"
                    value={personal.phone}
                    onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 text-sm mb-1">Photo URL</label>
                  <input
                    type="url"
                    value={personal.photoUrl}
                    onChange={(e) => setPersonal({ ...personal, photoUrl: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 text-sm mb-1">Professional Summary</label>
                  <textarea
                    value={personal.summary}
                    onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
                    placeholder="Brief summary of your professional background and goals..."
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-400" />
                Social Links
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    <Github className="w-4 h-4 inline mr-1" /> GitHub
                  </label>
                  <input
                    type="url"
                    value={social.github}
                    onChange={(e) => setSocial({ ...social, github: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    <Linkedin className="w-4 h-4 inline mr-1" /> LinkedIn
                  </label>
                  <input
                    type="url"
                    value={social.linkedin}
                    onChange={(e) => setSocial({ ...social, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full h-11 px-3 bg-gray-700/-600 rounded-lg text-white focus:50 border border-grayoutline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    <Globe className="w-4 h-4 inline mr-1" /> Portfolio
                  </label>
                  <input
                    type="url"
                    value={social.portfolio}
                    onChange={(e) => setSocial({ ...social, portfolio: e.target.value })}
                    placeholder="https://yourportfolio.com"
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-white font-semibold text-lg">Skills</h3>
                </div>
                <button
                  onClick={addSkill}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex gap-2">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                      placeholder="Skill name"
                      className="flex-1 h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    />
                    <select
                      value={skill.category}
                      onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                      className="w-32 h-10 px-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    >
                      {SKILL_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {skills.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-2">No skills added yet</p>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white font-semibold text-lg">Work Experience</h3>
                </div>
                <button
                  onClick={addExperience}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-400 text-sm">Experience #{experience.indexOf(exp) + 1}</span>
                      <button onClick={() => removeExperience(exp.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        placeholder="Position"
                        className="h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="Company"
                        className="h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      />
                      <input
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        className="h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      />
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={exp.current}
                          className="flex-1 h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500 disabled:opacity-50"
                        />
                        <label className="flex items-center gap-1 text-gray-400 text-sm">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                            className="w-4 h-4"
                          />
                          Present
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          placeholder="Job description and achievements..."
                          rows={3}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-white font-semibold text-lg">Projects</h3>
                </div>
                <button
                  onClick={addProject}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-400 text-sm">Project #{projects.indexOf(proj) + 1}</span>
                      <button onClick={() => removeProject(proj.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                        placeholder="Project name"
                        className="w-full h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      />
                      <input
                        type="text"
                        value={proj.technologies}
                        onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                        placeholder="Technologies used (e.g., React, Node.js, MongoDB)"
                        className="w-full h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      />
                      <input
                        type="url"
                        value={proj.link}
                        onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                        placeholder="Project link (GitHub, Live demo)"
                        className="w-full h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      />
                      <textarea
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                        placeholder="Project description..."
                        rows={2}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-orange-400" />
                  <h3 className="text-white font-semibold text-lg">Education</h3>
                </div>
                <button
                  onClick={addEducation}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-400 text-sm">Education #{education.indexOf(edu) + 1}</span>
                      <button onClick={() => removeEducation(edu.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        placeholder="Institution"
                        className="h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      />
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="Degree (B.Tech, M.S., etc.)"
                        className="h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      />
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                        placeholder="Field of study"
                        className="h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      />
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          className="flex-1 h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                        />
                        <label className="flex items-center gap-1 text-gray-400 text-sm">
                          <input
                            type="checkbox"
                            checked={edu.current}
                            onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                            className="w-4 h-4"
                          />
                          Present
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-pink-400" />
                  <h3 className="text-white font-semibold text-lg">Certifications</h3>
                </div>
                <button
                  onClick={addCertification}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-400 text-sm">Certification #{certifications.indexOf(cert) + 1}</span>
                      <button onClick={() => removeCertification(cert.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                        placeholder="Certification name"
                        className="h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      />
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                        placeholder="Issuing organization"
                        className="h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      />
                      <input
                        type="date"
                        value={cert.date}
                        onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                        className="h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      />
                      <input
                        type="url"
                        value={cert.link}
                        onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
                        placeholder="Verification link"
                        className="h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="xl:sticky xl:top-8 xl:h-fit">
              <div className={`rounded-2xl overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                {/* Preview Header */}
                <div className={`px-6 py-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Live Preview</span>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {theme === 'dark' ? 'Dark' : 'Light'} Theme
                  </span>
                </div>

                {/* Preview Content */}
                <div ref={printRef} className={`p-6 max-h-[800px] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                  {/* Header */}
                  <div className="text-center mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold">{personal.fullName || 'Your Name'}</h1>
                    <p className="text-blue-500">{personal.title || 'Professional Title'}</p>
                    <div className="flex flex-wrap justify-center gap-3 mt-2 text-sm text-gray-500">
                      {personal.email && <span>✉ {personal.email}</span>}
                      {personal.phone && <span>📞 {personal.phone}</span>}
                      {personal.location && <span>📍 {personal.location}</span>}
                    </div>
                    {social.github || social.linkedin || social.portfolio ? (
                      <div className="flex justify-center gap-4 mt-2 text-sm text-blue-500">
                        {social.github && <span>GitHub</span>}
                        {social.linkedin && <span>LinkedIn</span>}
                        {social.portfolio && <span>Portfolio</span>}
                      </div>
                    ) : null}
                  </div>

                  {/* Summary */}
                  {personal.summary && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2 border-b pb-1">Professional Summary</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{personal.summary}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2 border-b pb-1">Technical Skills</h2>
                      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                        <div key={category} className="mb-2">
                          <span className="font-medium text-sm">{category}: </span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {categorySkills.map(s => s.name).join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Experience */}
                  {experience.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2 border-b pb-1">Work Experience</h2>
                      {experience.map((exp) => (
                        <div key={exp.id} className="mb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">{exp.position}</span>
                              <span className="text-blue-500"> at {exp.company}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </span>
                          </div>
                          {exp.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Projects */}
                  {projects.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2 border-b pb-1">Projects</h2>
                      {projects.map((proj) => (
                        <div key={proj.id} className="mb-3">
                          <div className="flex justify-between">
                            <span className="font-medium">{proj.name}</span>
                            {proj.link && <a href={proj.link} className="text-blue-500 text-sm">Link</a>}
                          </div>
                          {proj.technologies && (
                            <p className="text-xs text-blue-500">{proj.technologies}</p>
                          )}
                          {proj.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{proj.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {education.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2 border-b pb-1">Education</h2>
                      {education.map((edu) => (
                        <div key={edu.id} className="mb-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{edu.degree} in {edu.field}</span>
                            <span className="text-sm text-gray-500">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{edu.institution}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Certifications */}
                  {certifications.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2 border-b pb-1">Certifications</h2>
                      {certifications.map((cert) => (
                        <div key={cert.id} className="mb-2 flex justify-between">
                          <span>{cert.name}</span>
                          <span className="text-sm text-gray-500">{cert.issuer} - {cert.date}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {!(personal.fullName || personal.summary || skills.length || experience.length || projects.length || education.length || certifications.length) && (
                    <div className="text-center text-gray-500 py-12">
                      <p>Start adding content to see your resume preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
