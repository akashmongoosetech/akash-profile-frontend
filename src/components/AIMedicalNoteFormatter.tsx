import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Copy, Check, AlertCircle, Sparkles, Shield, Clock, BookOpen, Users, Stethoscope, GraduationCap, Building } from 'lucide-react';
import { formatMedicalNote } from '../utils/aiApi';

const AIMedicalNoteFormatter: React.FC = () => {
  const [rawNotes, setRawNotes] = useState('');
  const [formatType, setFormatType] = useState('SOAP');
  const [specialty, setSpecialty] = useState('General');
  const [includeICD, setIncludeICD] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatTypes = ['SOAP', 'Progress Note', 'Consultation Note', 'EMR Structured'];
  const specialties = ['General', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology', 'Dermatology', 'Gastroenterology', 'Pulmonology', 'Endocrinology', 'Oncology'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rawNotes.trim()) {
      setError('Please enter clinical notes to format');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setDisclaimer(null);

    try {
      const response = await formatMedicalNote(rawNotes, formatType, specialty, includeICD);
      setResult(response.formattedNote);
      setDisclaimer(response.disclaimer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to format medical notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            AI Medical Note Formatter
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
            Transform raw, messy clinical notes into structured, professional medical documentation instantly
          </p>
        </motion.div>

        {/* Disclaimer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 dark:text-amber-200 font-medium text-sm">Important Disclaimer</p>
              <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                This tool formats medical notes but does not provide medical advice or diagnosis. Always review and verify all generated content for accuracy.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Input Clinical Notes
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Raw Notes Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Raw Clinical Notes
                </label>
                <textarea
                  value={rawNotes}
                  onChange={(e) => setRawNotes(e.target.value)}
                  placeholder="Enter unstructured clinical notes here...

Example: Patient John Doe 45yo male presented with chest pain radiating to left arm. BP 140/90 HR 98. ECG shows ST depression. Given aspirin 325mg. Suspicious for ACS. Admitted for observation. Will monitor troponins."
                  className="w-full h-64 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Format Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Format Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {formatTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormatType(type)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        formatType === type
                          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specialty
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Include ICD Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIncludeICD(!includeICD)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    includeICD ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      includeICD ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Include ICD-10 style diagnosis summary
                </span>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !rawNotes.trim()}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Formatting Notes...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Format Medical Notes
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                Formatted Output
              </h2>
              {result && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>

            {!result && !loading && (
              <div className="h-96 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Formatted notes will appear here</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Formatting your clinical notes...</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 max-h-[500px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                    {result}
                  </pre>
                </div>
                
                {disclaimer && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3">
                    <p className="text-amber-800 dark:text-amber-200 text-xs">{disclaimer}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Educational Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
              Understanding Medical Note Formatting
            </h2>

            {/* What is Medical Note Formatter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-indigo-500 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                What is a Medical Note Formatter?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                A medical note formatter is an AI-powered tool that transforms unstructured, raw clinical notes into standardized, professional medical documentation. It organizes scattered information into recognized formats like SOAP notes, Progress Notes, or Consultation Notes that are compatible with Electronic Medical Records (EMR) systems.
              </p>
            </div>

            {/* Why Structured Notes Matter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-indigo-500 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Why Structured Medical Notes Matter
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Legal Protection</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Well-documented notes serve as legal records and protect both patients and healthcare providers in case of disputes.
                  </p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Insurance Compliance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Insurance companies and Medicare require specific documentation formats for billing and claims processing.
                  </p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">EMR Compatibility</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Structured notes integrate seamlessly with Electronic Medical Record systems for better data management.
                  </p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Continuity of Care</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Clear documentation ensures other healthcare providers can understand patient history and continue care effectively.
                  </p>
                </div>
              </div>
            </div>

            {/* Common Documentation Problems */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-indigo-500 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Common Documentation Problems
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Illegible handwriting</strong> - Handwritten notes can be misinterpreted</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Missing sections</strong> - Incomplete notes lack critical patient information</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Inconsistent structure</strong> - Notes vary between providers, confusing others</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Time constraints</strong> - Busy clinicians rush through documentation</span>
                </li>
              </ul>
            </div>

            {/* How AI Formatting Works */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-indigo-500 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                How AI Formatting Works
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center mx-auto mb-3 font-bold">1</div>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Context Parsing</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI analyzes the raw text to understand clinical context</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center mx-auto mb-3 font-bold">2</div>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Segmentation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Information is categorized into appropriate sections</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center mx-auto mb-3 font-bold">3</div>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Pattern Recognition</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI identifies medical terms, diagnoses, and treatments</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center mx-auto mb-3 font-bold">4</div>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Formatting</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Output is structured per the selected format</p>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-indigo-500 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Use Cases
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Stethoscope className="w-8 h-8 text-indigo-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Hospital Doctors</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quickly format rounds notes and discharge summaries</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Building className="w-8 h-8 text-indigo-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Private Clinics</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Maintain consistent patient records</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Clock className="w-8 h-8 text-indigo-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Telemedicine</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Document virtual consultations efficiently</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <GraduationCap className="w-8 h-8 text-indigo-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Medical Interns</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Learn proper documentation standards</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Example Before & After */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-indigo-500 mb-3">Example: Before & After</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-red-700 dark:text-red-300 mb-3">Before (Raw Notes)</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap">
{`45yo M chest pain started 2hrs ago
radiating to left arm diaphoretic
BP 150/95 HR 110 troponin neg
give ASA 325mg ekg st depresion v4-v6
nitrates held bp low suspect ACS
admit obs unit monitor q4h`}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-green-700 dark:text-green-300 mb-3">After (SOAP Format)</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap">
{`SUBJECTIVE:
45-year-old male presents with chest pain
radiating to left arm, diaphoretic. Onset
2 hours prior to arrival.

OBJECTIVE:
- BP: 150/95 mmHg
- HR: 110 bpm
- ECG: ST depression V4-V6
- Troponin: Negative

ASSESSMENT:
Suspected Acute Coronary Syndrome (ACS)

PLAN:
1. Aspirin 325mg administered
2. Nitrates held due to hypotension
3. Admit to observation unit
4. Serial troponin monitoring q4h`}
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-indigo-500 mb-3">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <details className="group bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <summary className="cursor-pointer p-4 font-medium text-gray-800 dark:text-white flex items-center justify-between">
                    Is patient data stored?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                    No, patient data is not stored. Notes are processed in real-time and discarded after formatting. We prioritize patient privacy and data security.
                  </div>
                </details>
                <details className="group bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <summary className="cursor-pointer p-4 font-medium text-gray-800 dark:text-white flex items-center justify-between">
                    Is this HIPAA compliant?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                    Our tool is designed to support HIPAA compliance. However, healthcare providers are responsible for ensuring their use of the tool meets their specific compliance requirements.
                  </div>
                </details>
                <details className="group bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <summary className="cursor-pointer p-4 font-medium text-gray-800 dark:text-white flex items-center justify-between">
                    Can it integrate with EMR systems?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                    The formatted output can be copied and pasted into most EMR systems. Some formats like EMR Structured are specifically designed for easy integration.
                  </div>
                </details>
                <details className="group bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <summary className="cursor-pointer p-4 font-medium text-gray-800 dark:text-white flex items-center justify-between">
                    Does it provide medical diagnoses?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                    No, this tool does not provide medical advice or diagnoses. It only formats existing clinical information into structured documents. Always consult with qualified healthcare professionals for medical decisions.
                  </div>
                </details>
                <details className="group bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <summary className="cursor-pointer p-4 font-medium text-gray-800 dark:text-white flex items-center justify-between">
                    Can I customize the output format?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                    Yes, you can choose from SOAP, Progress Note, Consultation Note, and EMR Structured formats. Each has specific use cases and section arrangements.
                  </div>
                </details>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Save Time on Documentation</h3>
              <p className="text-indigo-100 mb-4">Format your clinical notes instantly with AI-powered precision</p>
              <button
                onClick={() => document.getElementById('rawNotes')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIMedicalNoteFormatter;
