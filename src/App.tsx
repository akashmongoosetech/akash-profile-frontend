import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Services from './pages/Services';
import Experience from './pages/Experience';
import Testimonials from './pages/Testimonials';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import BuildingScalableReactApplications from './pages/blogs/BuildingScalableReactApplications';
import ModernBackendDevelopment from './pages/blogs/ModernBackendDevelopment';
import DockerKubernetesDeployment from './pages/blogs/DockerKubernetesDeployment';
import FutureOfWebDevelopment from './pages/blogs/FutureOfWebDevelopment';
import DatabasePerformanceOptimization from './pages/blogs/DatabasePerformanceOptimization';
import ContactTable from './components/ContactTable';
import SubscriberTable from './components/SubscriberTable';

function App() {
  return (
    <ThemeProvider>
      <Router>
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
            <Route path="contact" element={<Contact />} />
            <Route path="admin" element={<Admin />} />
            <Route path="blog/building-scalable-react-applications" element={<BuildingScalableReactApplications />} />
            <Route path="blog/modern-backend-development" element={<ModernBackendDevelopment />} />
            <Route path="blog/docker-kubernetes-deployment" element={<DockerKubernetesDeployment />} />
            <Route path="blog/future-of-web-development" element={<FutureOfWebDevelopment />} />
            <Route path="blog/database-performance-optimization" element={<DatabasePerformanceOptimization />} />

            <Route path="ContactTable" element={<ContactTable />} />
            <Route path="SubscriberTable" element={<SubscriberTable />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;