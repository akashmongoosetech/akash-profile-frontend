import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Copy, Check, AlertCircle, Sparkles, Shield, Clock, BookOpen, Users, Building, HeartPulse, Stethoscope } from 'lucide-react';
import { generateDischargeSummary } from '../utils/aiApi';

const AIPatientDischargeSummaryGenerator: React.FC = () => {
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [admissionReason, setAdmissionReason] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentGiven, setTreatmentGiven] = useState('');
  const [proceduresPerformed, setProceduresPerformed] = useState('');
  const [medicationsPrescribed, setMedicationsPrescribed] = useState('');
  const [followUpInstructions, setFollowUpInstructions] = useState('');
  const [hospitalStayDuration, setHospitalStayDuration] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientAge || !patientGender || !admissionReason || !diagnosis) {
      setError('Please fill in all required fields (Patient Age, Gender, Admission Reason, Diagnosis)');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setDisclaimer(null);

    try {
      const response = await generateDischargeSummary(
        patientAge,
        patientGender,
        admissionReason,
        diagnosis,
        treatmentGiven,
        proceduresPerformed,
        medicationsPrescribed,
        followUpInstructions,
        hospitalStayDuration
      );
      setResult(response.dischargeSummary);
      setDisclaimer(response.disclaimer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate discharge summary. Please try again.');
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent mb-4">
            AI Patient Discharge Summary Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
            Generate structured, professional discharge summaries from patient case data instantly
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
                This tool assists in documentation drafting. Final medical review is required before use.
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
              <Sparkles className="w-5 h-5 text-rose-500" />
              Patient Case Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Demographics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patient Age *
                  </label>
                  <input
                    type="text"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="e.g., 45 years"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Hospital Stay Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hospital Stay Duration
                </label>
                <input
                  type="text"
                  value={hospitalStayDuration}
                  onChange={(e) => setHospitalStayDuration(e.target.value)}
                  placeholder="e.g., 5 days"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              {/* Admission Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admission Reason *
                </label>
                <textarea
                  value={admissionReason}
                  onChange={(e) => setAdmissionReason(e.target.value)}
                  placeholder="Describe why the patient was admitted..."
                  className="w-full h-24 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Diagnosis *
                </label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Primary diagnosis and any secondary diagnoses..."
                  className="w-full h-24 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Treatment Given */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Treatment Given
                </label>
                <textarea
                  value={treatmentGiven}
                  onChange={(e) => setTreatmentGiven(e.target.value)}
                  placeholder="Describe treatments administered during hospitalization..."
                  className="w-full h-24 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Procedures Performed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Procedures Performed
                </label>
                <textarea
                  value={proceduresPerformed}
                  onChange={(e) => setProceduresPerformed(e.target.value)}
                  placeholder="List any procedures performed..."
                  className="w-full h-20 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Medications Prescribed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Medications Prescribed
                </label>
                <textarea
                  value={medicationsPrescribed}
                  onChange={(e) => setMedicationsPrescribed(e.target.value)}
                  placeholder="List medications to be continued after discharge..."
                  className="w-full h-20 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Follow-up Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Follow-up Instructions
                </label>
                <textarea
                  value={followUpInstructions}
                  onChange={(e) => setFollowUpInstructions(e.target.value)}
                  placeholder="Follow-up appointments, wound care, activity restrictions..."
                  className="w-full h-20 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                />
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
                disabled={loading || !patientAge || !patientGender || !admissionReason || !diagnosis}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Discharge Summary
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
                <FileText className="w-5 h-5 text-rose-500" />
                Discharge Summary
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
                  <p>Generated summary will appear here</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Generating discharge summary...</p>
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
              Understanding Discharge Summaries
            </h2>

            {/* What is a Discharge Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-rose-500 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                What is a Discharge Summary?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                A discharge summary is a comprehensive medical document that summarizes a patient's hospital stay, including the reason for admission, diagnoses, treatments received, and instructions for post-discharge care. It serves as a critical link between hospital care and ongoing outpatient treatment, ensuring continuity of care for the patient.
              </p>
            </div>

            {/* Why Discharge Documentation is Critical */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-rose-500 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Why Discharge Documentation is Critical
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Continuity of Care</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ensures the next provider understands the full treatment history and can continue care seamlessly.
                  </p>
                </div>
                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Legal Protection</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Serves as a legal document of the care provided and patient instructions given.
                  </p>
                </div>
                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Patient Clarity</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Helps patients understand their condition and what they need to do after leaving the hospital.
                  </p>
                </div>
                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Insurance Claims</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Required for insurance reimbursement and billing purposes.
                  </p>
                </div>
              </div>
            </div>

            {/* Common Errors */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-rose-500 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Common Errors in Discharge Notes
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Missing medication details</strong> - Incomplete medication lists can lead to errors</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Unclear instructions</strong> - Vague follow-up instructions confuse patients</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span><strong>No follow-up plan</strong> - Missing appointments or monitoring instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Incomplete procedures list</strong> - Missing documentation of interventions</span>
                </li>
              </ul>
            </div>

            {/* How AI Helps */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-rose-500 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                How AI Helps Generate Better Discharge Summaries
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto mb-3 font-bold">1</div>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Standard Structure</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ensures all required sections are included</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto mb-3 font-bold">2</div>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Error Reduction</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Minimizes missing information and inconsistencies</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto mb-3 font-bold">3</div>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Time Efficiency</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Generates complete summaries in seconds</p>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-rose-500 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Use Cases
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Building className="w-8 h-8 text-rose-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Hospitals</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quickly generate discharge summaries for all departments</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <HeartPulse className="w-8 h-8 text-rose-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Nursing Homes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Document transfers between facilities</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Clock className="w-8 h-8 text-rose-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Telehealth Providers</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Document virtual hospitalizations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Stethoscope className="w-8 h-8 text-rose-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Multispecialty Clinics</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Handle complex patient transfers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Example Output */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-rose-500 mb-3">Example Output</h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <pre className="whitespace-pre-wrap text-xs text-gray-700 dark:text-gray-300 font-mono">
{`PATIENT DISCHARGE SUMMARY
==========================

PATIENT DETAILS
- Patient: [Name]
- Age: 45 years
- Gender: Male
- Date of Admission: [Date]
- Date of Discharge: [Date]
- Duration: 5 days

ADMISSION REASON
Patient presented with acute chest pain radiating to left arm,
associated with diaphoresis. Suspicion of Acute Coronary Syndrome.

HOSPITAL COURSE
Patient was admitted to cardiac ICU for monitoring and further
evaluation. Serial troponins were monitored. Cardiology consultation
was obtained. Patient responded well to conservative management.

DIAGNOSIS
Primary: Acute Coronary Syndrome (ACS)
Secondary: Hypertension

TREATMENT OVERVIEW
- Aspirin 325mg loading dose
- Heparin infusion
- Beta-blocker therapy
- Cardiac monitoring throughout stay
- Serial troponin monitoring

CONDITION AT DISCHARGE
Stable, improved

DISCHARGE MEDICATIONS
- Aspirin 81mg once daily
- Metoprolol 25mg twice daily
- Lisinopril 10mg once daily

FOLLOW-UP PLAN
- Follow-up with cardiology in 2 weeks
- ECG and stress test as outpatient
- Primary care follow-up in 1 week

LIFESTYLE ADVICE
- Low-sodium, low-fat diet
- Regular moderate exercise as tolerated
- Avoid strenuous activities for 4 weeks
- Smoking cessation recommended`}
                </pre>
              </div>
            </div>

            {/* FAQ */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-rose-500 mb-3">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <details className="group bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <summary className="cursor-pointer p-4 font-medium text-gray-800 dark:text-white flex items-center justify-between">
                    Is the generated summary medically accurate?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                    The tool generates summaries based on the information you provide. Always have a qualified physician review the final document for accuracy and completeness.
                  </div>
                </details>
                <details className="group bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <summary className="cursor-pointer p-4 font-medium text-gray-800 dark:text-white flex items-center justify-between">
                    Does this replace doctors?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                    No, this tool assists in drafting documentation but does not replace medical professionals. All generated content requires physician review and approval.
                  </div>
                </details>
                <details className="group bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <summary className="cursor-pointer p-4 font-medium text-gray-800 dark:text-white flex items-center justify-between">
                    Can it export to PDF?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                    Currently, you can copy the generated summary and paste it into any document editor to save as PDF. We're working on direct PDF export.
                  </div>
                </details>
                <details className="group bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <summary className="cursor-pointer p-4 font-medium text-gray-800 dark:text-white flex items-center justify-between">
                    Is patient data stored?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                    No patient data is stored. All information is processed in real-time and discarded immediately after generating the summary.
                  </div>
                </details>
                <details className="group bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <summary className="cursor-pointer p-4 font-medium text-gray-800 dark:text-white flex items-center justify-between">
                    Can it handle complex cases?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                    Yes, the tool can handle complex cases with multiple diagnoses, procedures, and medications. Provide as much detail as possible for the best results.
                  </div>
                </details>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Generate Professional Discharge Summaries</h3>
              <p className="text-rose-100 mb-4">Create comprehensive discharge documentation in seconds</p>
              <button
                onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-white text-rose-600 font-semibold rounded-lg hover:bg-rose-50 transition-colors"
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

export default AIPatientDischargeSummaryGenerator;
