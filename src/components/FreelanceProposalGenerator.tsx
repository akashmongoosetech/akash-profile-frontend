import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2,
  Download, 
  Copy, 
  ClipboardCheck,
  Eye,
  EyeOff,
  RefreshCw,
  User,
  Briefcase,
  Clock,
  Star,
  Send
} from 'lucide-react';
import jsPDF from 'jspdf';

/**
 * FreelanceProposalGenerator Component
 * 
 * A professional freelance proposal generator with PDF export and copy functionality.
 * Features:
 * - Freelancer and client details
 * - Dynamic deliverables list
 * - Timeline and budget sections
 * - Why Choose Me section
 * - Professional formatted output
 * - PDF download
 * - Copy to clipboard
 * - Clean layout
 */

// ==================== TypeScript Interfaces ====================

export interface Deliverable {
  id: string;
  name: string;
  description: string;
}

export interface ProposalData {
  freelancerName: string;
  clientName: string;
  projectTitle: string;
  projectDescription: string;
  deliverables: Deliverable[];
  timeline: string;
  budget: string;
  whyChooseMe: string;
  callToAction: string;
}

// ==================== Helper Functions ====================

const createEmptyDeliverable = (): Deliverable => ({
  id: crypto.randomUUID(),
  name: '',
  description: ''
});

const generateProposalContent = (data: ProposalData): string => {
  const { freelancerName, clientName, projectTitle, projectDescription, deliverables, timeline, budget, whyChooseMe, callToAction } = data;
  
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const fName = freelancerName || '[Your Name]';
  const cName = clientName || '[Client Name]';
  const projTitle = projectTitle || '[Project Title]';
  const projDesc = projectDescription || '[Project Description]';
  const projTimeline = timeline || '[Timeline]';
  const projBudget = budget || '[Budget]';
  const whyMe = whyChooseMe || '[Why Choose Me Section]';
  const cta = callToAction || '[Call to Action]';
  
  const deliverablesList = deliverables.length > 0 && deliverables[0].name
    ? deliverables.map((d, i) => `${i + 1}. ${d.name}\n   ${d.description}`).join('\n\n')
    : '• [Deliverable 1]\n• [Deliverable 2]';
  
  return `╔════════════════════════════════════════════════════════════════════════╗
║                      FREELANCE PROJECT PROPOSAL                           ║
╚════════════════════════════════════════════════════════════════════════╝

Prepared by: ${fName}
Date: ${today}
Client: ${cName}

════════════════════════════════════════════════════════════════════════
                            PROJECT OVERVIEW
════════════════════════════════════════════════════════════════════════

Project: ${projTitle}

${projDesc}

════════════════════════════════════════════════════════════════════════
                            DELIVERABLES
════════════════════════════════════════════════════════════════════════

${deliverablesList}

════════════════════════════════════════════════════════════════════════
                              TIMELINE
════════════════════════════════════════════════════════════════════════

${projTimeline}

════════════════════════════════════════════════════════════════════════
                               PRICING
════════════════════════════════════════════════════════════════════════

Total Project Cost: ${projBudget}

[Include payment schedule details here]

════════════════════════════════════════════════════════════════════════
                          WHY CHOOSE ME
════════════════════════════════════════════════════════════════════════

${whyMe}

[Highlight your unique skills, experience, and value proposition]

════════════════════════════════════════════════════════════════════════
                           NEXT STEPS
════════════════════════════════════════════════════════════════════════

${cta}

[Call to action - e.g., "Looking forward to hearing from you!"]

────────────────────────────────────────────────────────────────────────
Thank you for considering my proposal!

${fName}
[Your Contact Information]
[Your Portfolio/Website]
[Your Email]
[Your Phone]

════════════════════════════════════════════════════════════════════════
`.trim();
};

// ==================== Component ====================

const FreelanceProposalGenerator: React.FC = () => {
  // State for proposal data
  const [freelancerName, setFreelancerName] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [deliverables, setDeliverables] = useState<Deliverable[]>([createEmptyDeliverable()]);
  const [timeline, setTimeline] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [whyChooseMe, setWhyChooseMe] = useState<string>('');
  const [callToAction, setCallToAction] = useState<string>('Looking forward to working with you!');
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Build proposal data object
  const proposalData: ProposalData = useMemo(() => ({
    freelancerName,
    clientName,
    projectTitle,
    projectDescription,
    deliverables,
    timeline,
    budget,
    whyChooseMe,
    callToAction
  }), [freelancerName, clientName, projectTitle, projectDescription, deliverables, timeline, budget, whyChooseMe, callToAction]);

  // Generate proposal content
  const proposalContent = useMemo(() => generateProposalContent(proposalData), [proposalData]);

  // Add deliverable
  const addDeliverable = () => {
    setDeliverables([...deliverables, createEmptyDeliverable()]);
  };

  // Remove deliverable
  const removeDeliverable = (id: string) => {
    if (deliverables.length > 1) {
      setDeliverables(deliverables.filter(d => d.id !== id));
    }
  };

  // Update deliverable
  const updateDeliverable = (id: string, field: keyof Deliverable, value: string) => {
    setDeliverables(deliverables.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(proposalContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    
    const lines = proposalContent.split('\n');
    let yPos = 20;
    
    doc.setFontSize(12);
    
    lines.forEach((line) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      if (line.includes('═') || line.includes('║') || line.includes('╗') || line.includes('╝')) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
      } else if (line.match(/^[A-Z\s]+$/)) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
      } else if (line.match(/^\d+\./)) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
      }
      
      doc.text(line, 15, yPos);
      yPos += 5;
    });
    
    doc.save('freelance-proposal.pdf');
  };

  // Reset form
  const handleReset = () => {
    setFreelancerName('');
    setClientName('');
    setProjectTitle('');
    setProjectDescription('');
    setDeliverables([createEmptyDeliverable()]);
    setTimeline('');
    setBudget('');
    setWhyChooseMe('');
    setCallToAction('Looking forward to working with you!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 mb-4">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Freelance Proposal Generator</h1>
          <p className="text-gray-400">Create winning freelance proposals instantly</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-between mb-6 no-print">
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {copied ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-1 xl:grid-cols-2 gap-8 ${showPreview ? '' : 'max-w-3xl mx-auto'}`}>
          {/* Form Section */}
          <div className="space-y-6">
            {/* Basic Details */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-rose-400" />
                Basic Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Your Name</label>
                  <input
                    type="text"
                    value={freelancerName}
                    onChange={(e) => setFreelancerName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Client Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 text-sm mb-1">Project Title</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Website Redesign Project"
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 text-sm mb-1">Project Description</label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe the project goals and scope..."
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Deliverables */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  Deliverables
                </h3>
                <button
                  onClick={addDeliverable}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-3">
                {deliverables.map((deliverable) => (
                  <div key={deliverable.id} className="bg-gray-700/30 rounded-lg p-3">
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={deliverable.name}
                        onChange={(e) => updateDeliverable(deliverable.id, 'name', e.target.value)}
                        placeholder="Deliverable name"
                        className="flex-1 h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                      />
                      {deliverables.length > 1 && (
                        <button
                          onClick={() => removeDeliverable(deliverable.id)}
                          className="p-2 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={deliverable.description}
                      onChange={(e) => updateDeliverable(deliverable.id, 'description', e.target.value)}
                      placeholder="Brief description of this deliverable"
                      className="w-full h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline & Budget */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Timeline & Budget
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Timeline</label>
                  <textarea
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    placeholder="Week 1: Design approval&#10;Week 2-3: Development&#10;Week 4: Testing & Launch"
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Budget</label>
                  <textarea
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Total: $5,000&#10;- 50% upfront: $2,500&#10;- 50% on completion: $2,500"
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Why Choose Me & CTA */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                Why Choose Me & CTA
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Why Choose Me</label>
                  <textarea
                    value={whyChooseMe}
                    onChange={(e) => setWhyChooseMe(e.target.value)}
                    placeholder="Highlight your unique skills, experience, and value proposition..."
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Call to Action</label>
                  <input
                    type="text"
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                    placeholder="Looking forward to working with you!"
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="xl:sticky xl:top-8 xl:h-fit">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 bg-gray-700 flex items-center justify-between">
                  <span className="font-semibold text-white">Proposal Preview</span>
                  <span className="text-sm text-gray-400">Freelance Proposal</span>
                </div>
                <div className="p-6 max-h-[800px] overflow-y-auto bg-gray-800">
                  <pre className="whitespace-pre-wrap text-xs text-gray-300 font-mono leading-relaxed">
                    {proposalContent}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelanceProposalGenerator;
