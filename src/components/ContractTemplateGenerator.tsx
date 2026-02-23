import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Copy, 
  ClipboardCheck,
  FileText,
  Eye,
  EyeOff,
  RefreshCw,
  Scale,
  Briefcase,
  Shield,
  UserCheck,
  Users
} from 'lucide-react';
import jsPDF from 'jspdf';

/**
 * ContractTemplateGenerator Component
 * 
 * A professional contract template generator with PDF export and copy functionality.
 * Features:
 * - Multiple contract types (Service Agreement, NDA, Freelance Contract, Employment Contract)
 * - Dynamic input fields based on contract type
 * - Legal-style formatting with clauses
 * - PDF download
 * - Copy to clipboard
 * - Clean professional layout
 */

// ==================== TypeScript Interfaces ====================

export type ContractType = 'service' | 'nda' | 'freelance' | 'employment';

export interface ContractData {
  type: ContractType;
  clientName: string;
  contractorName: string;
  companyName: string;
  projectDescription: string;
  paymentAmount: string;
  paymentTerms: string;
  startDate: string;
  endDate: string;
  jurisdiction: string;
}

// ==================== Contract Templates ====================

const generateContractContent = (data: ContractData): string => {
  const { type, clientName, contractorName, companyName, projectDescription, paymentAmount, paymentTerms, startDate, endDate, jurisdiction } = data;
  
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '[Start Date]';
  const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '[End Date]';
  
  const cName = clientName || '[Client Name]';
  const ctrName = contractorName || '[Contractor Name]';
  const compName = companyName || '[Company Name]';
  const projDesc = projectDescription || '[Project/Job Description]';
  const payAmount = paymentAmount || '[Amount]';
  const payTerms = paymentTerms || '[Payment Terms]';
  const jurisdictionLaw = jurisdiction || '[Jurisdiction]';
  
  // Generate different contracts based on type
  if (type === 'service') {
    return `SERVICE AGREEMENT
═══════════════════════════════════════════════════════════════════

This Service Agreement ("Agreement") is entered into as of ${today}

CLIENT: ${cName}
(hereinafter referred to as "Client")

SERVICE PROVIDER: ${ctrName}
(hereinafter referred to as "Service Provider")

─────────────────────────────────────────────────────────────────────

1. SCOPE OF SERVICES

The Service Provider agrees to provide the following services:

${projDesc}

2. PAYMENT TERMS

The Client agrees to pay the Service Provider:

Amount: ${payAmount}
Payment Terms: ${payTerms}

3. TERM AND TERMINATION

This Agreement shall commence on ${formattedStartDate} and continue 
until ${formattedEndDate}, unless earlier terminated.

Either party may terminate this Agreement with 30 days written notice.

4. CONFIDENTIALITY

Both parties agree to maintain the confidentiality of any proprietary 
information shared during the course of this engagement.

5. INTELLECTUAL PROPERTY

All work product created under this Agreement shall be the property 
of ${compName}, upon full payment.

6. GOVERNING LAW

This Agreement shall be governed by the laws of ${jurisdictionLaw}.

─────────────────────────────────────────────────────────────────────

SIGNATURES

Client: ___________________________    Date: ___________

${cName}

Contractor: _________________________    Date: ___________

${ctrName}

═══════════════════════════════════════════════════════════════════
      This is a legal document. Please consult with an attorney.
═══════════════════════════════════════════════════════════════════`;
  }
  
  if (type === 'nda') {
    return `NON-DISCLOSURE AGREEMENT (NDA)
═══════════════════════════════════════════════════════════════════

This Non-Disclosure Agreement ("Agreement") is entered into as of 
${today} by and between:

DISCLOSING PARTY: ${cName}
(hereinafter referred to as "Disclosing Party")

RECEIVING PARTY: ${ctrName}
(hereinafter referred to as "Receiving Party")

─────────────────────────────────────────────────────────────────────

1. DEFINITION OF CONFIDENTIAL INFORMATION

"Confidential Information" means any and all non-public information 
disclosed by the Disclosing Party to the Receiving Party, including 
business plans, financial information, technical data, customer 
lists, trade secrets, and project details.

2. OBLIGATIONS OF RECEIVING PARTY

The Receiving Party agrees to hold and maintain the Confidential 
Information in strict confidence and not disclose to any third parties.

3. TERM

This Agreement shall remain in effect from ${formattedStartDate} 
until ${formattedEndDate}.

4. RETURN OF INFORMATION

Upon termination, the Receiving Party shall promptly return or 
destroy all Confidential Information.

5. GOVERNING LAW

This Agreement shall be governed by the laws of ${jurisdictionLaw}.

─────────────────────────────────────────────────────────────────────

SIGNATURES

Disclosing Party: ______________________    Date: ___________

${cName}

Receiving Party: ________________________    Date: ___________

${ctrName}

═══════════════════════════════════════════════════════════════════
      This is a legal document. Please consult with an attorney.
═══════════════════════════════════════════════════════════════════`;
  }
  
  if (type === 'freelance') {
    return `FREELANCE CONTRACT
═══════════════════════════════════════════════════════════════════

This Freelance Contract ("Agreement") is entered into as of ${today}

CLIENT: ${cName}
(hereinafter referred to as "Client")

FREELANCER: ${ctrName}
(hereinafter referred to as "Freelancer")

─────────────────────────────────────────────────────────────────────

1. PROJECT DESCRIPTION

The Freelancer agrees to complete the following project:

${projDesc}

2. COMPENSATION

The Client agrees to pay the Freelancer:

Total Amount: ${payAmount}
Payment Schedule: ${payTerms}

3. TIMELINE

Project Start Date: ${formattedStartDate}
Project End Date: ${formattedEndDate}

4. DELIVERABLES

${projDesc}

5. INDEPENDENT CONTRACTOR STATUS

The Freelancer is an independent contractor and not an employee 
of the Client.

6. CONFIDENTIALITY

The Freelancer agrees to maintain confidentiality regarding all 
client information and project details.

7. INTELLECTUAL PROPERTY

Upon full payment, all deliverables shall become the property 
of the Client.

8. TERMINATION

Either party may terminate this Agreement with 14 days written notice.
Payment shall be made for work completed.

9. GOVERNING LAW

This Agreement shall be governed by the laws of ${jurisdictionLaw}.

─────────────────────────────────────────────────────────────────────

SIGNATURES

Client: ___________________________    Date: ___________

${cName}

Freelancer: ________________________    Date: ___________

${ctrName}

═══════════════════════════════════════════════════════════════════
      This is a legal document. Please consult with an attorney.
═══════════════════════════════════════════════════════════════════`;
  }
  
  // Employment contract
  return `EMPLOYMENT CONTRACT
═══════════════════════════════════════════════════════════════════

This Employment Contract ("Agreement") is entered into as of ${today}

EMPLOYER: ${compName}
(hereinafter referred to as "Employer")

EMPLOYEE: ${ctrName}
(hereinafter referred to as "Employee")

─────────────────────────────────────────────────────────────────────

1. POSITION AND DUTIES

The Employee is hired for the position of:

${projDesc}

The Employee's duties shall include the responsibilities outlined above.

2. COMPENSATION

The Employer agrees to pay the Employee:

Salary: ${payAmount}
Payment Terms: ${payTerms}

3. EMPLOYMENT TERM

Start Date: ${formattedStartDate}
End Date: ${formattedEndDate || 'Permanent'}

This is a permanent employment position.

4. WORKING HOURS

Standard working hours shall be 40 hours per week.

5. BENEFITS

The Employee shall be entitled to health insurance coverage, 
paid time off, and other benefits as per company policy.

6. CONFIDENTIALITY

The Employee agrees to maintain confidentiality of all proprietary 
information, trade secrets, and business information.

7. TERMINATION

Either party may terminate this Agreement with 30 days notice.
The Employer may terminate immediately for cause.

8. GOVERNING LAW

This Agreement shall be governed by the laws of ${jurisdictionLaw}.

─────────────────────────────────────────────────────────────────────

SIGNATURES

Employer: _________________________    Date: ___________

${compName}

Employee: _________________________    Date: ___________

${ctrName}

═══════════════════════════════════════════════════════════════════
      This is a legal document. Please consult with an attorney.
═══════════════════════════════════════════════════════════════════`;
};

// ==================== Component ====================

const ContractTemplateGenerator: React.FC = () => {
  // State for contract data
  const [contractType, setContractType] = useState<ContractType>('service');
  const [clientName, setClientName] = useState<string>('');
  const [contractorName, setContractorName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentTerms, setPaymentTerms] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [jurisdiction, setJurisdiction] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Build contract data object
  const contractData: ContractData = useMemo(() => ({
    type: contractType,
    clientName,
    contractorName,
    companyName,
    projectDescription,
    paymentAmount,
    paymentTerms,
    startDate,
    endDate,
    jurisdiction
  }), [contractType, clientName, contractorName, companyName, projectDescription, paymentAmount, paymentTerms, startDate, endDate, jurisdiction]);

  // Generate contract content
  const contractContent = useMemo(() => generateContractContent(contractData), [contractData]);

  // Get contract type info
  const getContractTypeInfo = (type: ContractType) => {
    switch (type) {
      case 'service': return { label: 'Service Agreement', icon: <Scale className="w-4 h-4" />, desc: 'Agreement for providing professional services' };
      case 'nda': return { label: 'NDA', icon: <Shield className="w-4 h-4" />, desc: 'Non-Disclosure Agreement' };
      case 'freelance': return { label: 'Freelance Contract', icon: <Briefcase className="w-4 h-4" />, desc: 'Contract for freelance work' };
      case 'employment': return { label: 'Employment Contract', icon: <Users className="w-4 h-4" />, desc: 'Standard employment agreement' };
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contractContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    
    const lines = contractContent.split('\n');
    let yPos = 20;
    
    doc.setFontSize(12);
    
    lines.forEach((line) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      if (line.includes('=')) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
      } else if (line.match(/^\d+\./)) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
      }
      
      doc.text(line, 15, yPos);
      yPos += 6;
    });
    
    doc.save(`${contractType}-contract.pdf`);
  };

  // Reset form
  const handleReset = () => {
    setClientName('');
    setContractorName('');
    setCompanyName('');
    setProjectDescription('');
    setPaymentAmount('');
    setPaymentTerms('');
    setStartDate('');
    setEndDate('');
    setJurisdiction('');
  };

  // Contract type options
  const contractTypes: ContractType[] = ['service', 'nda', 'freelance', 'employment'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Contract Template Generator</h1>
          <p className="text-gray-400">Create professional legal contracts instantly</p>
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
              {copied ? 'Copied!' : 'Copy Contract'}
            </button>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-1 xl:grid-cols-2 gap-8 ${showPreview ? '' : 'max-w-3xl mx-auto'}`}>
          {/* Form Section */}
          <div className="space-y-6">
            {/* Contract Type */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                Contract Type
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {contractTypes.map((type) => {
                  const info = getContractTypeInfo(type);
                  return (
                    <button
                      key={type}
                      onClick={() => setContractType(type)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        contractType === type
                          ? 'border-amber-500 bg-amber-500/20'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={contractType === type ? 'text-amber-400' : 'text-gray-400'}>
                          {info.icon}
                        </span>
                        <span className="text-white font-medium">{info.label}</span>
                      </div>
                      <p className="text-gray-400 text-xs">{info.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Party Details */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-400" />
                Party Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    {contractType === 'employment' ? 'Company Name' : 'Client Name'}
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Client/Company Name"
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    {contractType === 'employment' ? 'Employee Name' : 'Contractor/Freelancer Name'}
                  </label>
                  <input
                    type="text"
                    value={contractorName}
                    onChange={(e) => setContractorName(e.target.value)}
                    placeholder="Contractor Name"
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Company Name (Optional)</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company Name"
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Jurisdiction</label>
                  <input
                    type="text"
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    placeholder="State/Country"
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Project & Payment Details */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-green-400" />
                Project & Payment Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    {contractType === 'employment' ? 'Job Title / Position' : 'Project Description'}
                  </label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder={contractType === 'employment' ? 'Software Engineer' : 'Describe the services...'}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Payment Amount</label>
                    <input
                      type="text"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="$5,000 or $50/hr"
                      className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Payment Terms</label>
                    <input
                      type="text"
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      placeholder="Net 30 / 50% upfront"
                      className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="xl:sticky xl:top-8 xl:h-fit">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 bg-gray-700 flex items-center justify-between">
                  <span className="font-semibold text-white">Contract Preview</span>
                  <span className="text-sm text-gray-400">{getContractTypeInfo(contractType).label}</span>
                </div>
                <div className="p-6 max-h-[800px] overflow-y-auto bg-gray-800">
                  <pre className="whitespace-pre-wrap text-xs text-gray-300 font-mono leading-relaxed">
                    {contractContent}
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

export default ContractTemplateGenerator;
