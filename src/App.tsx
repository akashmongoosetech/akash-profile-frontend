import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './Home';
import About from './About';
import Projects from './projects/Projects';
import Skills from './skills/Skills';
import Services from './services/Services';
import Experience from './experience/Experience';
import Testimonials from './testimonials/Testimonials';
import Blog from './blogs/Blog';
import BlogPost from './blog-posts/BlogPost';
import Contact from './contacts/Contact';
import Admin from './admins/Admin';
import AdminLogin from './admins/AdminLogin';
import AdminLayout from './admins/AdminLayout';
import ContactTable from './contact-tables/ContactTable';
import SubscriberTable from './subscriber-tables/SubscriberTable';
import BlogManagement from './blog-management/BlogManagement';
import WebsiteCostCalculator from './components/WebsiteCostCalculator';
import EMICalculator from './components/EMICalculator';
import SEOAuditMiniTool from './components/SEOAuditMiniTool';
import InvoiceGenerator from './components/InvoiceGenerator';
import QuotationGenerator from './components/QuotationGenerator';
import ResumeBuilder from './components/ResumeBuilder';

function App() {
  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
            <Route path="contact" element={<Contact />} />
            <Route path="website-cost-calculator" element={<WebsiteCostCalculator />} />
            <Route path="emi-calculator" element={<EMICalculator />} />
            <Route path="seo-audit-mini-tool" element={<SEOAuditMiniTool />} />
            <Route path="invoice-generator" element={<InvoiceGenerator />} />
            <Route path="quotation-generator" element={<QuotationGenerator />} />
            <Route path="resume-builder" element={<ResumeBuilder />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Admin />} />
            <Route path="blog-management" element={<BlogManagement />} />
            <Route path="contact-table" element={<ContactTable />} />
            <Route path="subscriber-table" element={<SubscriberTable />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;