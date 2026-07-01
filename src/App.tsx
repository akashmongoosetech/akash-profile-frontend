import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
// Lazy load components
const Home = lazy(() => import('./Home'));
const About = lazy(() => import('./About'));
const Projects = lazy(() => import('./projects/Projects'));
const Skills = lazy(() => import('./skills/Skills'));
const Services = lazy(() => import('./services/Services'));
const Experience = lazy(() => import('./experience/Experience'));
const Testimonials = lazy(() => import('./testimonials/Testimonials'));
const Blog = lazy(() => import('./blogs/Blog'));
const BlogPost = lazy(() => import('./blog-posts/BlogPost'));
const Contact = lazy(() => import('./contacts/Contact'));
const Admin = lazy(() => import('./admins/Admin'));
const CaseStudies = lazy(() => import('./case-studies/CaseStudies'));
const AdminLogin = lazy(() => import('./admins/AdminLogin'));
const AdminLayout = lazy(() => import('./admins/AdminLayout'));
const ContactTable = lazy(() => import('./contact-tables/ContactTable'));
const SubscriberTable = lazy(() => import('./subscriber-tables/SubscriberTable'));
const BlogManagement = lazy(() => import('./blog-management/BlogManagement'));
const EventManagement = lazy(() => import('./event-management/EventManagement'));
const CaseStudiesManagement = lazy(() => import('./case-studies-management/CaseStudiesManagement'));
const WebsiteCostCalculator = lazy(() => import('./components/WebsiteCostCalculator'));
const EMICalculator = lazy(() => import('./components/EMICalculator'));
const SEOAuditMiniTool = lazy(() => import('./components/SEOAuditMiniTool'));
const InvoiceGenerator = lazy(() => import('./components/InvoiceGenerator'));
const QuotationGenerator = lazy(() => import('./components/QuotationGenerator'));
const ResumeBuilder = lazy(() => import('./components/ResumeBuilder'));
const MeetingAgendaGenerator = lazy(() => import('./components/MeetingAgendaGenerator'));
const ContractTemplateGenerator = lazy(() => import('./components/ContractTemplateGenerator'));
const FreelanceProposalGenerator = lazy(() => import('./components/FreelanceProposalGenerator'));
const AIEmailReplyGenerator = lazy(() => import('./components/AIEmailReplyGenerator'));
const LinkedInPostGenerator = lazy(() => import('./components/LinkedInPostGenerator'));
const ProjectIdeaGenerator = lazy(() => import('./components/ProjectIdeaGenerator'));
const AIBusinessIdeaValidator = lazy(() => import('./components/AIBusinessIdeaValidator'));
const AIStartupNameGenerator = lazy(() => import('./components/AIStartupNameGenerator'));
const AIBusinessPlanGenerator = lazy(() => import('./components/AIBusinessPlanGenerator'));
const AIMedicalNoteFormatter = lazy(() => import('./components/AIMedicalNoteFormatter'));
const AIPatientDischargeSummaryGenerator = lazy(() => import('./components/AIPatientDischargeSummaryGenerator'));
const AIClinicWebsiteContentGenerator = lazy(() => import('./components/AIClinicWebsiteContentGenerator'));
const AISQLQueryGenerator = lazy(() => import('./components/AISQLQueryGenerator'));
const AIProjectDescriptionGenerator = lazy(() => import('./components/AIProjectDescriptionGenerator'));
const AIInternshipCoverLetterGenerator = lazy(() => import('./components/AIInternshipCoverLetterGenerator'));
const AIPersonalStatementGenerator = lazy(() => import('./components/AIPersonalStatementGenerator'));
const AIPortfolioBioGenerator = lazy(() => import('./components/AIPortfolioBioGenerator'));
const AIMeetingSummaryGenerator = lazy(() => import('./components/AIMeetingSummaryGenerator'));
const Tools = lazy(() => import('./Tools'));
const AIChat = lazy(() => import('./components/AIChat'));
const Events = lazy(() => import('./events/Events'));
const EventDetail = lazy(() => import('./events/EventDetail'));

function App() {
  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-900"><div className="text-white text-xl">Loading...</div></div>}>
          <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="projects" element={<Projects />} />
            <Route path="skills" element={<Skills />} />
            <Route path="services" element={<Services />} />
            <Route path="experience" element={<Experience />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:slug" element={<EventDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="case-studies" element={<CaseStudies />} />
            <Route path="website-cost-calculator" element={<WebsiteCostCalculator />} />
            <Route path="emi-calculator" element={<EMICalculator />} />
            <Route path="seo-audit-mini-tool" element={<SEOAuditMiniTool />} />
            <Route path="invoice-generator" element={<InvoiceGenerator />} />
            <Route path="quotation-generator" element={<QuotationGenerator />} />
            <Route path="resume-builder" element={<ResumeBuilder />} />
            <Route path="meeting-agenda-generator" element={<MeetingAgendaGenerator />} />
            <Route path="contract-template-generator" element={<ContractTemplateGenerator />} />
            <Route path="freelance-proposal-generator" element={<FreelanceProposalGenerator />} />
            <Route path="ai-email-reply-generator" element={<AIEmailReplyGenerator />} />
            <Route path="linkedIn-post-generator-for-developers" element={<LinkedInPostGenerator />} />
            <Route path="project-idea-generator-for-students" element={<ProjectIdeaGenerator />} />
            <Route path="ai-business-idea-validator" element={<AIBusinessIdeaValidator />} />
            <Route path="ai-startup-name-generator" element={<AIStartupNameGenerator />} />
            <Route path="ai-business-plan-generator" element={<AIBusinessPlanGenerator />} />
            <Route path="ai-medical-note-formatter" element={<AIMedicalNoteFormatter />} />
            <Route path="ai-patient-discharge-summary-generator" element={<AIPatientDischargeSummaryGenerator />} />
            <Route path="ai-clinic-website-content-generator" element={<AIClinicWebsiteContentGenerator />} />
            <Route path="ai-sql-query-generator" element={<AISQLQueryGenerator />} />
            <Route path="ai-project-description-generator" element={<AIProjectDescriptionGenerator />} />
            <Route path="ai-internship-cover-letter-generator" element={<AIInternshipCoverLetterGenerator />} />
            <Route path="ai-personal-statement-generator" element={<AIPersonalStatementGenerator />} />
            <Route path="ai-portfolio-bio-generator" element={<AIPortfolioBioGenerator />} />
            <Route path="ai-meeting-summary-generator" element={<AIMeetingSummaryGenerator />} />
            <Route path="tools" element={<Tools />} />
            <Route path="ai-chat" element={<AIChat />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Admin />} />
            <Route path="blog-management" element={<BlogManagement />} />
            <Route path="event-management" element={<EventManagement />} />
            <Route path="case-studies-management" element={<CaseStudiesManagement />} />
            <Route path="contact-table" element={<ContactTable />} />
            <Route path="subscriber-table" element={<SubscriberTable />} />
          </Route>
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;